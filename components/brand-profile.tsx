"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { toast } from "@/components/ui/use-toast"

interface BrandProfileProps {
  onBrandProfileChange: (profile: any) => void
  initialBrandProfile: any
  readOnly?: boolean
}

const CHANNEL_SUGGESTIONS = [
  "Digital Advertising",
  "Digital Publishing",
  "Event Activations",
  "News, Press, Media",
  "Outbound Sales",
  "Print Advertising",
  "Referrals & Partnerships",
  "Product Experience",
  "Retail",
  "Social Media",
]

export default function BrandProfile({
  onBrandProfileChange,
  initialBrandProfile,
  readOnly = false,
}: BrandProfileProps) {
  const [profile, setProfile] = useState({
    ...initialBrandProfile,
    companyName: initialBrandProfile.companyName || "",
    domainUrl: initialBrandProfile.domainUrl || "",
    products: Array.isArray(initialBrandProfile.products) ? initialBrandProfile.products : [],
  })
  const [newTeamMember, setNewTeamMember] = useState("")
  const [newSegment, setNewSegment] = useState("")
  const [newChannel, setNewChannel] = useState("")
  const [newProduct, setNewProduct] = useState("")
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    onBrandProfileChange(profile)
  }, [profile, onBrandProfileChange])

  const addItem = (field: string, item: string) => {
    if (item.trim()) {
      setProfile((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()],
      }))
    }
  }

  const removeItem = (field: string, item: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((i: string) => i !== item),
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
        setProfile((prev) => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateDomainUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/
    return pattern.test(url)
  }

  const handleDomainUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setProfile((prev) => ({ ...prev, domainUrl: url }))
    if (url && !validateDomainUrl(url)) {
      toast({
        title: "Invalid Domain URL",
        description: "Please enter a valid domain URL (e.g., example.com or www.example.com)",
        variant: "destructive",
      })
    }
  }

  const enrichProfile = () => {
    // In a real application, you would call the BrandFetch API here
    // For now, we'll use sample data
    const sampleData = {
      segments: ["Small Businesses", "Startups", "Enterprise"],
      channels: ["Social Media", "Content Marketing", "Email Marketing"],
      products: ["CRM Software", "Marketing Automation", "Analytics Tool"],
    }

    setProfile((prev) => ({
      ...prev,
      segments: [...new Set([...prev.segments, ...sampleData.segments])],
      channels: [...new Set([...prev.channels, ...sampleData.channels])],
      products: [...new Set([...prev.products, ...sampleData.products])],
    }))

    toast({
      title: "Profile Enriched",
      description: "Sample data has been added to your profile.",
    })
  }

  const formatBudget = (value: number) => {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
  }

  const parseBudget = (value: string) => {
    return Number.parseInt(value.replace(/,/g, ""), 10)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Company Name */}
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            {readOnly ? (
              <p>{profile.companyName}</p>
            ) : (
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
              />
            )}
          </div>

          {/* Domain URL */}
          <div>
            <Label htmlFor="domainUrl">Domain URL</Label>
            {readOnly ? (
              <p>{profile.domainUrl}</p>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="domainUrl"
                  value={profile.domainUrl}
                  onChange={handleDomainUrlChange}
                  placeholder="Enter domain URL"
                />
                <Button onClick={enrichProfile} disabled={readOnly}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Enrich Profile
                </Button>
              </div>
            )}
          </div>

          {/* Logo */}
          <div>
            <Label htmlFor="logo">Upload Logo (Black horizontal, preferred)</Label>
            {readOnly ? (
              <p>{logo}</p>
            ) : (
              <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
            )}
            {logo && (
              <div className="mt-2">
                <img src={logo || "/placeholder.svg"} alt="Brand Logo" className="max-h-20" />
              </div>
            )}
          </div>

          {/* Total Budget */}
          <div>
            <Label htmlFor="totalBudget">Total Budget</Label>
            {readOnly ? (
              <p>${formatBudget(profile.totalBudget)}</p>
            ) : (
              <Input
                id="totalBudget"
                value={formatBudget(profile.totalBudget)}
                onChange={(e) => {
                  const parsed = parseBudget(e.target.value)
                  if (!isNaN(parsed)) {
                    setProfile((prev) => ({ ...prev, totalBudget: parsed }))
                  }
                }}
              />
            )}
          </div>

          {/* Personnel, Segments, Products */}
          {["personnel", "segments", "products"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              {readOnly ? (
                <div className="flex flex-wrap gap-2">
                  {(profile[field] || []).map((item: string) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id={field}
                      value={field === "personnel" ? newTeamMember : field === "segments" ? newSegment : newProduct}
                      onChange={(e) => {
                        if (field === "personnel") setNewTeamMember(e.target.value)
                        else if (field === "segments") setNewSegment(e.target.value)
                        else setNewProduct(e.target.value)
                      }}
                      placeholder={`Add ${field.slice(0, -1)}`}
                    />
                    <Button
                      onClick={() => {
                        if (field === "personnel") {
                          addItem(field, newTeamMember)
                          setNewTeamMember("")
                        } else if (field === "segments") {
                          addItem(field, newSegment)
                          setNewSegment("")
                        } else {
                          addItem(field, newProduct)
                          setNewProduct("")
                        }
                      }}
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile[field] || []).map((item: string) => (
                      <Badge key={item} variant="secondary">
                        {item}
                        <button onClick={() => removeItem(field, item)} className="ml-2 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Channels */}
          <div>
            <Label htmlFor="channels">Channels</Label>
            {readOnly ? (
              <div className="flex flex-wrap gap-2">
                {profile.channels.map((channel: string) => (
                  <Badge key={channel} variant="secondary">
                    {channel}
                  </Badge>
                ))}
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-2">
                  <Combobox
                    options={CHANNEL_SUGGESTIONS}
                    value={newChannel}
                    onChange={setNewChannel}
                    placeholder="Add channel"
                  />
                  <Button
                    onClick={() => {
                      addItem("channels", newChannel)
                      setNewChannel("")
                    }}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.channels.map((channel: string) => (
                    <Badge key={channel} variant="secondary">
                      {channel}
                      <button onClick={() => removeItem("channels", channel)} className="ml-2 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

