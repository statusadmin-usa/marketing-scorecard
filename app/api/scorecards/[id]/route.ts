import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // In a real application, you would fetch the scorecard data from your database
  // This is just a mock implementation
  const mockScorecard = {
    id: params.id,
    ownerName: "John Doe",
    brandProfile: {
      companyName: "Acme Inc.",
      domainUrl: "https://acme.com",
      totalBudget: 1000000,
      personnel: ["John Doe", "Jane Smith"],
      products: ["Product A", "Product B"],
      segments: ["Segment 1", "Segment 2"],
      channels: ["Social Media", "Email Marketing"],
    },
    // Add other scorecard data as needed
  }

  return NextResponse.json(mockScorecard)
}

