"use client"

import { useState, useRef, useEffect } from "react"
import { Save, LogIn, Download, Plus, Share2, ChevronDown, ChevronUp, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import BrandProfile from "../components/brand-profile"
import MarketingMixTable from "../components/marketing-mix-table"
import Benchmarks from "../components/benchmarks"
import { UserAvatar } from "../components/user-avatar"
import { generatePDF } from "../utils/generate-pdf"
import { toast } from "@/components/ui/use-toast"
import LoginSignup from "../components/login-signup"
import { Input } from "@/components/ui/input"

interface User {
  name: string
  email: string
  accountType: "free" | "paid"
  downloadsRemaining: number
}

interface Scorecard {
  id: string
  name: string
  data: any
}

export default function MarketingScorecard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [brandProfile, setBrandProfile] = useState({
    companyName: "",
    domainUrl: "",
    totalBudget: 50000,
    personnel: [],
    products: [],
    segments: [],
    channels: [],
    logo: null,
  })
  const [scorecards, setScorecards] = useState<Scorecard[]>([])
  const [currentScorecard, setCurrentScorecard] = useState<Scorecard | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLink, setShareLink] = useState("")

  const [collapsedSections, setCollapsedSections] = useState({
    brandProfile: false,
    marketingMix: false,
    benchmarks: false,
  })

  const sectionRefs = {
    brandProfile: useRef<HTMLDivElement>(null),
    marketingMix: useRef<HTMLDivElement>(null),
    benchmarks: useRef<HTMLDivElement>(null),
  }

  const handleLogin = (userData: User) => {
    setIsLoggedIn(true)
    setUser(userData)
    setShowLoginDialog(false)
    toast({
      title: "Welcome back!",
      description: "You're now logged in!",
    })
  }

  const handleSaveScorecard = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    const newScorecard: Scorecard = {
      id: `SC-${Date.now()}`,
      name: `Scorecard ${scorecards.length + 1}`,
      data: {
        brandProfile,
        // Add other scorecard data here
      },
    }

    setScorecards([...scorecards, newScorecard])
    setCurrentScorecard(newScorecard)

    toast({
      title: "Scorecard saved",
      description: "Your scorecard has been successfully saved.",
    })
  }

  const handleNewScorecard = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    if (user?.accountType === "free" && scorecards.length >= 3) {
      toast({
        title: "Scorecard limit reached",
        description: "Upgrade to a paid account to create more scorecards.",
        variant: "destructive",
      })
      return
    }

    // Save current scorecard
    handleSaveScorecard()

    // Reset form data
    setBrandProfile({
      companyName: "",
      domainUrl: "",
      totalBudget: 50000,
      personnel: [],
      products: [],
      segments: [],
      channels: [],
      logo: null,
    })

    toast({
      title: "New scorecard created",
      description: "You can now start working on your new scorecard.",
    })
  }

  const handleShareScorecard = () => {
    if (!currentScorecard) {
      toast({
        title: "No scorecard selected",
        description: "Please save or select a scorecard before sharing.",
        variant: "destructive",
      })
      return
    }

    handleSaveScorecard()

    const shareUrl = `${window.location.origin}/shared-scorecard/${currentScorecard.id}`
    setShareLink(shareUrl)
    setShowShareDialog(true)
  }

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Share link copied",
      description: "The share link has been copied to your clipboard.",
    })
  }

  const handleDownloadPDF = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    if (user?.accountType === "free" && user.downloadsRemaining === 0) {
      toast({
        title: "Download limit reached",
        description: "Upgrade to a paid account for unlimited downloads.",
        variant: "destructive",
      })
      return
    }

    generatePDF(currentScorecard?.data || { brandProfile })

    if (user?.accountType === "free") {
      setUser((prev) => (prev ? { ...prev, downloadsRemaining: prev.downloadsRemaining - 1 } : null))
    }

    toast({
      title: "PDF Generated",
      description: "Your scorecard PDF has been downloaded.",
    })
  }

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadScorecard = (scorecard: Scorecard) => {
    setCurrentScorecard(scorecard)
    setBrandProfile(scorecard.data.brandProfile)
    // Load other scorecard data here
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for the header

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            // Add an active class to the corresponding nav item
            document.querySelector(`[data-section="${key}"]`)?.classList.add("bg-accent")
          } else {
            document.querySelector(`[data-section="${key}"]`)?.classList.remove("bg-accent")
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Removed sectionRefs from dependencies

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Scorecard</h1>
        <div className="flex gap-2 items-center">
          {!isLoggedIn && (
            <Button onClick={() => setShowLoginDialog(true)}>
              <LogIn className="mr-2 h-4 w-4" /> Log In / Sign Up
            </Button>
          )}
          {isLoggedIn && user && <UserAvatar user={user} scorecards={scorecards} onSelectScorecard={loadScorecard} />}
        </div>
      </div>

      <nav className="flex space-x-2 sticky top-0 bg-background z-10 py-2">
        <Button variant="ghost" onClick={() => scrollToSection("brandProfile")} data-section="brandProfile">
          Brand Profile
        </Button>
        <Button variant="ghost" onClick={() => scrollToSection("marketingMix")} data-section="marketingMix">
          Marketing Mix
        </Button>
        <Button variant="ghost" onClick={() => scrollToSection("benchmarks")} data-section="benchmarks">
          Benchmarks
        </Button>
      </nav>

      <div ref={sectionRefs.brandProfile}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Brand Profile</h2>
          <Button variant="ghost" onClick={() => toggleSection("brandProfile")}>
            {collapsedSections.brandProfile ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
        {!collapsedSections.brandProfile && (
          <BrandProfile onBrandProfileChange={setBrandProfile} initialBrandProfile={brandProfile} />
        )}
      </div>

      <div ref={sectionRefs.marketingMix}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Marketing Mix</h2>
          <Button variant="ghost" onClick={() => toggleSection("marketingMix")}>
            {collapsedSections.marketingMix ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
        {!collapsedSections.marketingMix && (
          <MarketingMixTable totalBudget={brandProfile.totalBudget} channels={brandProfile.channels} />
        )}
      </div>

      <div ref={sectionRefs.benchmarks}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Benchmarks</h2>
          <Button variant="ghost" onClick={() => toggleSection("benchmarks")}>
            {collapsedSections.benchmarks ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
        {!collapsedSections.benchmarks && (
          <Benchmarks totalBudget={brandProfile.totalBudget} personnel={brandProfile.personnel} />
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleSaveScorecard}>
          <Save className="mr-2 h-4 w-4" /> Save Scorecard
        </Button>
        <Button onClick={handleNewScorecard}>
          <Plus className="mr-2 h-4 w-4" /> New Scorecard
        </Button>
        <Button onClick={handleShareScorecard}>
          <Share2 className="mr-2 h-4 w-4" /> Share Scorecard
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download PDF
          {user?.accountType === "free" && ` (${user.downloadsRemaining} left)`}
        </Button>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log In or Sign Up</DialogTitle>
          </DialogHeader>
          <LoginSignup onLogin={handleLogin} />
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Scorecard</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareLink} readOnly />
            <Button onClick={handleCopyShareLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

