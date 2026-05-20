import os
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

# 1. Define Team State
class TeamState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    next_node: str

# 2. Initialize LLM (Gemini 2.5 Flash)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

# 3. Define the Supervisor Node
def supervisor_node(state: TeamState):
    messages = state["messages"]
    
    system_prompt = (
        "You are the team Supervisor managing a research and writing workflow.\n"
        "Look at the last message in the history:\n"
        "- If the user just asked a question, choose 'Researcher'.\n"
        "- If the 'Researcher' just provided facts, choose 'Writer'.\n"
        "- If the 'Writer' has provided a completed article summary, choose 'FINISH'.\n"
        "Respond ONLY with one word: 'Researcher', 'Writer', or 'FINISH'. Do not add punctuation."
    )
    
    response = llm.invoke([SystemMessage(content=system_prompt)] + list(messages))
    decision = response.content.strip()
    
    print(f"\n[SUPERVISOR]: Decision -> {decision}")
    return {"next_node": decision}

# 4. Define DYNAMIC Worker Nodes using the LLM
def researcher_node(state: TeamState):
    print("[RESEARCHER]: Gathering deep facts via Gemini...")
    # Get the original user request from the first message
    user_topic = state["messages"][0].content
    
    prompt = f"Provide 3 highly interesting, specific facts about this topic: {user_topic}. Be brief."
    response = llm.invoke(prompt)
    
    return {"messages": [HumanMessage(content=response.content, name="Researcher")]}

def writer_node(state: TeamState):
    print("[WRITER]: Crafting the summary article via Gemini...")
    # Find the researcher's findings in the history
    research_content = ""
    for msg in reversed(state["messages"]):
        if getattr(msg, "name", "") == "Researcher":
            research_content = msg.content
            break
            
    prompt = f"Turn these facts into a short, compelling 1-paragraph summary:\n\n{research_content}"
    response = llm.invoke(prompt)
    
    return {"messages": [HumanMessage(content=response.content, name="Writer")]}

# 5. Define Routing Function for Conditional Edges
def route_next(state: TeamState) -> str:
    target = state.get("next_node", "FINISH")
    if "FINISH" in target or target == "__end__":
        return "FINISH"
    return target

# 6. Build the Graph Workflow
builder = StateGraph(TeamState)

# Add our active nodes
builder.add_node("Supervisor", supervisor_node)
builder.add_node("Researcher", researcher_node)
builder.add_node("Writer", writer_node)

# Set up graph entry point
builder.set_entry_point("Supervisor")

# Workers report back to supervisor to check progress
builder.add_edge("Researcher", "Supervisor")
builder.add_edge("Writer", "Supervisor")

# Add conditional edge mapping
builder.add_conditional_edges(
    "Supervisor",
    route_next,
    {
        "Researcher": "Researcher",
        "Writer": "Writer",
        "FINISH": END
    }
)

# Compile graph
graph = builder.compile()

# 7. Execute the Flow
if __name__ == "__main__":
    print("--- Starting Multi-Agent Team Run ---")
    
    initial_input = {
        "messages": [HumanMessage(content="Write a short summary discussing how multi-agent teams work.")]
    }
    
    config = {"configurable": {"thread_id": "1"}}
    final_state = graph.invoke(initial_input, config=config)
    
    print("\n--- Final Output ---")
    # Print the final item written by the writer agent
    for msg in reversed(final_state["messages"]):
        if getattr(msg, "name", "") == "Writer":
            print(msg.content)
            break
            
    print("\n--- Text-Based Graph Architecture ---")
    try:
        graph.print_ascii()
    except Exception:
        print("[Supervisor] -> [Researcher/Writer] -> [END]")