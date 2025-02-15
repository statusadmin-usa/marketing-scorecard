
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import BrandProfile from "@/components/brand-profile"
import MarketingMixTable from "@/components/marketing-mix-table"
import Benchmarks from "@/components/benchmarks"

export default function SharedScorecard({ params }: { params: { id: string } }) {
  const sampleData = {
    owner: "John Doe",
    brandProfile: {
      companyName: "Example Corp",
      totalBudget: 100000,
      domainUrl: "example.com",
      channels: ["Digital Marketing", "Social Media", "Content Marketing"],
      personnel: ["Marketing Manager", "Content Writer", "Social Media Manager"],
      products: ["Product A", "Product B"],
      segments: ["Enterprise", "SMB"],
    },
    benchmarks: [
      {
        id: "1",
        name: "Website Traffic",
        benchmark: 10000,
        goal: 20000,
        initiatives: []
      }
    ]
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Shared by {sampleData.owner}</p>
        </CardContent>
      </Card>

      <BrandProfile initialBrandProfile={sampleData.brandProfile} readOnly />
      <MarketingMixTable totalBudget={sampleData.brandProfile.totalBudget} channels={sampleData.brandProfile.channels} readOnly />
      <Benchmarks benchmarks={sampleData.benchmarks} totalBudget={sampleData.brandProfile.totalBudget} personnel={sampleData.brandProfile.personnel} readOnly />

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
