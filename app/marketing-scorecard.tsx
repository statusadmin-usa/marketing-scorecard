"use client"

import { useState } from "react"
import { Save, LogIn, Download, Plus, Share2 as Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandProfile from "../components/brand-profile"
import MarketingMixTable from "../components/marketing-mix-table"
import Benchmarks from "../components/benchmarks"
import { UserAvatar } from "../components/user-avatar"
import { generatePDF } from "../utils/generate-pdf"

export default function MarketingScorecard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scorecards, setScorecards] = useState([
    { id: "1", name: "Scorecard 1" },
    { id: "2", name: "Scorecard 2" },
  ])
  const [currentScorecard, setCurrentScorecard] = useState(null)

  const handleSaveAndSignUp = () => {
    setIsLoggedIn(true)
    alert("Your scorecard has been saved! You're now signed up.")
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    alert("You're now logged in!")
  }

  const handleDownloadPDF = () => {
    generatePDF({
      brandProfile: {},
      marketingMix: {},
      benchmarks: {}
    })
  }

  const handleSaveScorecard = () => {
    alert("Scorecard saved!")
  }

  const handleNewScorecard = () => {
    handleSaveScorecard()
    const newScorecard = {
      id: `${scorecards.length + 1}`,
      name: `Scorecard ${scorecards.length + 1}`,
    }
    setScorecards([...scorecards, newScorecard])
    setCurrentScorecard(newScorecard.id)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Scorecard</h1>
        <div className="flex gap-2 items-center">
          {!isLoggedIn && (
            <>
              <Button onClick={handleSaveAndSignUp}>
                <Save className="mr-2 h-4 w-4" /> Save & Sign Up
              </Button>
              <Button onClick={handleLogin} variant="outline">
                <LogIn className="mr-2 h-4 w-4" /> Log In
              </Button>
              <Button 
                onClick={() => {
                  const shareUrl = `/share/${Date.now()}`
                  window.open(shareUrl, '_blank')
                }} 
                variant="secondary"
              >
                <Share className="mr-2 h-4 w-4" /> Share
              </Button>
            </>
          )}
          {isLoggedIn && (
            <UserAvatar
              user={{ name: "John Doe", email: "john@example.com" }}
              scorecards={scorecards}
              onSelectScorecard={setCurrentScorecard}
            />
          )}
        </div>
      </div>

      <BrandProfile />
      <MarketingMixTable 
        totalBudget={50000}
        channels={[
          "Social Media",
          "Content Marketing",
          "Email Marketing",
          "SEO",
          "Paid Advertising",
          "Events"
        ]} 
      />
      <Benchmarks />

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleSaveScorecard}>
          <Save className="mr-2 h-4 w-4" /> Save Scorecard
        </Button>
        <Button onClick={handleNewScorecard}>
          <Plus className="mr-2 h-4 w-4" /> New Scorecard
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
    </div>
  )
}