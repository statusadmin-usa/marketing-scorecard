"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BrandProfile from "../../../components/brand-profile"
import MarketingMixTable from "../../../components/marketing-mix-table"
import Benchmarks from "../../../components/benchmarks"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type SharedScorecardProps = {}

export default function SharedScorecard({}: SharedScorecardProps) {
  const params = useParams()
  const [scorecard, setScorecard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the scorecard data based on the ID
    const fetchScorecard = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/scorecards/${params.id}`)
        const data = await response.json()
        setScorecard(data)
      } catch (error) {
        console.error("Error fetching scorecard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScorecard()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!scorecard) {
    return <div>Scorecard not found</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Scorecard</h1>
        <p className="text-muted-foreground">
          Shared by: <span className="font-semibold">{scorecard.ownerName}</span>
        </p>
      </div>

      <BrandProfile initialBrandProfile={scorecard.brandProfile} readOnly />
      <MarketingMixTable
        totalBudget={scorecard.brandProfile.totalBudget}
        channels={scorecard.brandProfile.channels}
        readOnly
      />
      <Benchmarks
        totalBudget={scorecard.brandProfile.totalBudget}
        personnel={scorecard.brandProfile.personnel}
        readOnly
      />

      <div className="mt-8 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create Your Own Marketing Scorecard</h2>
        <p className="mb-4">
          Unlock the power of data-driven marketing strategies. Sign up now to create your personalized Marketing
          Scorecard and take your campaigns to the next level.
        </p>
        <Button>
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

