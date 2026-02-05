import { NextRequest, NextResponse } from 'next/server'

// Mock responses for demo purposes
// In production, this will connect to OpenClaw Gateway
const mockResponses = [
  "That's a great question! Let me help you with that.\n\n**Here's what I found:**\n\n1. First, consider the main approach\n2. Then, evaluate alternatives\n3. Finally, make your decision\n\nWould you like me to elaborate on any of these points?",
  "I've analyzed your request and here's my take:\n\n> The key insight is to focus on what matters most.\n\nLet me break this down:\n\n- **Priority 1**: Start with the foundation\n- **Priority 2**: Build incrementally\n- **Priority 3**: Test and iterate\n\nAnything specific you'd like me to dive deeper into?",
  "Interesting! Here's what I can tell you about that:\n\n```javascript\n// Example code snippet\nconst result = await processRequest(data);\nconsole.log('Success!', result);\n```\n\nThis approach is commonly used because it's:\n- Simple to understand\n- Easy to maintain\n- Highly performant\n\nShall I explain more?",
  "I'm on it! 🚀\n\nHere's my analysis:\n\n### Summary\nYour question touches on several important areas.\n\n### Recommendations\n1. Start small and scale up\n2. Document as you go\n3. Review regularly\n\n### Next Steps\nWould you like me to help you implement any of these suggestions?",
  "Great thinking! Let me add to that...\n\nThe approach you're considering has both **pros** and **cons**:\n\n| Aspect | Rating |\n|--------|--------|\n| Complexity | Low |\n| Scalability | High |\n| Maintenance | Medium |\n\nBased on this, I'd recommend moving forward with caution but optimism. What do you think?",
]

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate thinking time (1-3 seconds)
    await new Promise((resolve) => 
      setTimeout(resolve, 1000 + Math.random() * 2000)
    )

    // Select a random mock response
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    // In production, this would call:
    // const response = await fetch('http://localhost:3210/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // })

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
