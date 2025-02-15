
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import BrandProfile from "@/components/brand-profile"
import MarketingMixTable from "@/components/marketing-mix-table"
import Benchmarks from "@/components/benchmarks"

export default function SharedScorecard({ params }: { params: { id: string } }) {
  // In a real implementation, you would fetch the scorecard data using the ID
  const mockData = {
    owner: "John Doe",
    brandProfile: {
      companyName: "Example Corp",
      totalBudget: 50000,
      channels: ["Digital", "Social"],
      personnel: ["John", "Jane"],
      products: ["Product A"],
      segments: ["Segment 1"],
    },
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Shared by {mockData.owner}</p>
        </CardContent>
      </Card>

      <BrandProfile onBrandProfileChange={() => {}} initialBrandProfile={mockData.brandProfile} readOnly />
      <MarketingMixTable totalBudget={mockData.brandProfile.totalBudget} channels={mockData.brandProfile.channels} readOnly />
      <Benchmarks totalBudget={mockData.brandProfile.totalBudget} personnel={mockData.brandProfile.personnel} readOnly />

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-2">Create Your Own Marketing Scorecard</h2>
          <p className="mb-4">Build and track your marketing strategy with our powerful tools.</p>
          <Link href="/">
            <Button variant="secondary">Get Started</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
