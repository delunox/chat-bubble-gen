"use client"

import type React from "react"
import { useState, useRef, useCallback, type ChangeEvent, useEffect } from "react"
import { toPng, toJpeg, toSvg } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  RotateCcw,
  ImageIcon,
  Link2,
  UserCircle,
  MessageSquareText,
  Paintbrush,
  Eye,
  Sparkles,
  Palette,
  Settings,
  ImageIcon as ImageIconLucide,
  CheckCircle,
  Copy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_NAME = "Dexter Morgan"
const DEFAULT_MESSAGE = "Hey there! This is a customizable chat bubble. Try changing the styles!"
const DEFAULT_BUBBLE_BG_TYPE = "linear-gradient"
const DEFAULT_BUBBLE_BG_COLOR1 = "#667EEA" // Beautiful gradient blue
const DEFAULT_BUBBLE_BG_COLOR2 = "#764BA2" // Beautiful gradient purple
const DEFAULT_GRADIENT_ANGLE = 135
const DEFAULT_NAME_TEXT_COLOR = "#FFFFFF"
const DEFAULT_MESSAGE_TEXT_COLOR = "#FFFFFF"
const DEFAULT_FONT_SIZE_NAME = 15
const DEFAULT_FONT_SIZE_MESSAGE = 16
const DEFAULT_PADDING = 20
const DEFAULT_CORNER_RADIUS = 24
const DEFAULT_EXPORT_FORMAT = "png"
const DEFAULT_PROFILE_PIC_ENABLED = true
const DEFAULT_PROFILE_PIC_URL =
  "https://i.pinimg.com/736x/91/9d/c2/919dc23964a1cb1245811fddc72cba0f.jpg"
const DEFAULT_BUBBLE_STYLE = "chatApp"
const DEFAULT_TAIL_POSITION = "topLeft"
const DEFAULT_NAME_ALIGN = "left"
const DEFAULT_MESSAGE_ALIGN = "left"

type BubbleStyle = "chatApp" | "standard" | "fullyRounded" | "square"
type TailPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "none"
type TextAlign = "left" | "center" | "right" | "justify"
type BackgroundType = "solid" | "linear-gradient" | "radial-gradient"

// Preset
const PRESET_THEMES = [
  {
    name: "Ocean Blue",
    bubbleBgColor1: "#667EEA",
    bubbleBgColor2: "#764BA2",
    backgroundType: "linear-gradient",
    gradientAngle: 135,
  },
  {
    name: "Sunset Orange",
    bubbleBgColor1: "#FF6B6B",
    bubbleBgColor2: "#FFE66D",
    backgroundType: "linear-gradient",
    gradientAngle: 45,
  },
  {
    name: "Forest Green",
    bubbleBgColor1: "#11998E",
    bubbleBgColor2: "#38EF7D",
    backgroundType: "linear-gradient",
    gradientAngle: 90,
  },
  {
    name: "Purple Dream",
    bubbleBgColor1: "#A8EDEA",
    bubbleBgColor2: "#FED6E3",
    backgroundType: "linear-gradient",
    gradientAngle: 180,
  },
  {
    name: "Dark Mode",
    bubbleBgColor1: "#2D3748",
    bubbleBgColor2: "#2D3748",
    backgroundType: "solid",
    gradientAngle: 0,
  },
]

export default function ChatBubbleGenerator() {
  const { toast } = useToast()
  const [name, setName] = useState<string>(DEFAULT_NAME)
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE)
  const [profilePicBorderWidth, setProfilePicBorderWidth] = useState<number>(3)
  const [profilePicBorderStyle, setProfilePicBorderStyle] = useState<string>("solid")
  const [profilePicBorderColor, setProfilePicBorderColor] = useState<string>("rgba(255,255,255,0.8)")
  const [bio, setBio] = useState<string>("UI/UX Designer")
  const [bioTextColor, setBioTextColor] = useState<string>("rgba(255,255,255,0.8)")
  const [bioFontSize, setBioFontSize] = useState<number>(12)
  const [bioTextAlign, setBioTextAlign] = useState<TextAlign>(DEFAULT_MESSAGE_ALIGN)
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(DEFAULT_BUBBLE_BG_TYPE)
  const [bubbleBgColor1, setBubbleBgColor1] = useState<string>(DEFAULT_BUBBLE_BG_COLOR1)
  const [bubbleBgColor2, setBubbleBgColor2] = useState<string>(DEFAULT_BUBBLE_BG_COLOR2)
  const [gradientAngle, setGradientAngle] = useState<number>(DEFAULT_GRADIENT_ANGLE)

  const [nameTextColor, setNameTextColor] = useState<string>(DEFAULT_NAME_TEXT_COLOR)
  const [messageTextColor, setMessageTextColor] = useState<string>(DEFAULT_MESSAGE_TEXT_COLOR)
  const [fontSizeName, setFontSizeName] = useState<number>(DEFAULT_FONT_SIZE_NAME)
  const [fontSizeMessage, setFontSizeMessage] = useState<number>(DEFAULT_FONT_SIZE_MESSAGE)
  const [padding, setPadding] = useState<number>(DEFAULT_PADDING)
  const [cornerRadius, setCornerRadius] = useState<number>(DEFAULT_CORNER_RADIUS)
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>(DEFAULT_BUBBLE_STYLE)
  const [tailPosition, setTailPosition] = useState<TailPosition>(DEFAULT_TAIL_POSITION)
  const [nameTextAlign, setNameTextAlign] = useState<TextAlign>(DEFAULT_NAME_ALIGN)
  const [messageTextAlign, setMessageTextAlign] = useState<TextAlign>(DEFAULT_MESSAGE_ALIGN)
  const [profilePicEnabled, setProfilePicEnabled] = useState<boolean>(DEFAULT_PROFILE_PIC_ENABLED)
  const [profilePicUrl, setProfilePicUrl] = useState<string>(DEFAULT_PROFILE_PIC_URL)
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(DEFAULT_PROFILE_PIC_URL || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exportFormat, setExportFormat] = useState<string>(DEFAULT_EXPORT_FORMAT)
  const exportNodeRef = useRef<HTMLDivElement>(null)
  const [bubbleShape, setBubbleShape] = useState<string>("rectangle")
  const [bubbleOpacity, setBubbleOpacity] = useState<number>(1)
  const [animationStyle, setAnimationStyle] = useState<string>("fadeIn")
  const [boxShadowEnabled, setBoxShadowEnabled] = useState<boolean>(true)
  const [boxShadowColor, setBoxShadowColor] = useState<string>("rgba(0,0,0,0.15)")
  const [boxShadowOffsetX, setBoxShadowOffsetX] = useState<number>(0)
  const [boxShadowOffsetY, setBoxShadowOffsetY] = useState<number>(8)
  const [boxShadowBlur, setBoxShadowBlur] = useState<number>(25)
  const [boxShadowSpread, setBoxShadowSpread] = useState<number>(0)
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null)
  const [exportedImageData, setExportedImageData] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string)
      }
      reader.readAsDataURL(profilePicFile)
    } else if (profilePicUrl) {
      setProfilePicPreview(profilePicUrl)
    } else {
      setProfilePicPreview(null)
    }
  }, [profilePicFile, profilePicUrl])

  const applyPresetTheme = (theme: (typeof PRESET_THEMES)[0]) => {
    setBubbleBgColor1(theme.bubbleBgColor1)
    setBubbleBgColor2(theme.bubbleBgColor2)
    setBackgroundType(theme.backgroundType as BackgroundType)
    setGradientAngle(theme.gradientAngle)
    toast({ title: "Theme Applied", description: `${theme.name} theme has been applied!` })
  }

  const handleResetSettings = () => {
    setName(DEFAULT_NAME)
    setMessage(DEFAULT_MESSAGE)
    setBackgroundType(DEFAULT_BUBBLE_BG_TYPE)
    setBubbleBgColor1(DEFAULT_BUBBLE_BG_COLOR1)
    setBubbleBgColor2(DEFAULT_BUBBLE_BG_COLOR2)
    setGradientAngle(DEFAULT_GRADIENT_ANGLE)
    setNameTextColor(DEFAULT_NAME_TEXT_COLOR)
    setMessageTextColor(DEFAULT_MESSAGE_TEXT_COLOR)
    setFontSizeName(DEFAULT_FONT_SIZE_NAME)
    setFontSizeMessage(DEFAULT_FONT_SIZE_MESSAGE)
    setPadding(DEFAULT_PADDING)
    setCornerRadius(DEFAULT_CORNER_RADIUS)
    setBubbleStyle(DEFAULT_BUBBLE_STYLE)
    setTailPosition(DEFAULT_TAIL_POSITION)
    setNameTextAlign(DEFAULT_NAME_ALIGN)
    setMessageTextAlign(DEFAULT_MESSAGE_ALIGN)
    setProfilePicEnabled(DEFAULT_PROFILE_PIC_ENABLED)
    setProfilePicUrl(DEFAULT_PROFILE_PIC_URL)
    setProfilePicFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setExportFormat(DEFAULT_EXPORT_FORMAT)

    setProfilePicBorderWidth(3)
    setProfilePicBorderStyle("solid")
    setProfilePicBorderColor("rgba(255,255,255,0.8)")
    setBio("UI/UX Designer")
    setBioTextColor("rgba(255,255,255,0.8)")
    setBioFontSize(12)
    setBioTextAlign(DEFAULT_MESSAGE_ALIGN)

    setBubbleShape("rectangle")
    setBubbleOpacity(1)
    setAnimationStyle("fadeIn")
    setBoxShadowEnabled(true)
    setBoxShadowColor("rgba(0,0,0,0.15)")
    setBoxShadowOffsetX(0)
    setBoxShadowOffsetY(8)
    setBoxShadowBlur(25)
    setBoxShadowSpread(0)
    setExportedImageUrl(null)
    setExportedImageData(null)

    toast({ title: "Settings Reset", description: "All settings have been reset to their defaults." })
  }

  const handleExport = useCallback(async () => {
    if (exportNodeRef.current === null) {
      toast({ title: "Export Error", description: "Preview element not found.", variant: "destructive" })
      return
    }

    setIsExporting(true)
    const nodeToExport = exportNodeRef.current
    const originalBg = nodeToExport.style.backgroundColor

    if (exportFormat === "jpeg") {
      nodeToExport.style.backgroundColor = "#FFFFFF"
    }

    const options = {
      cacheBust: true,
      pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio * 2.5 : 3,
      filter: (node: HTMLElement) => {
        if (node.tagName === "IMG") {
          const img = node as HTMLImageElement
          if (!img.complete || img.naturalWidth === 0) {
            return new Promise((resolve) => {
              img.onload = () => resolve(true)
              img.onerror = () => resolve(false)
            })
          }
        }
        return true
      },
    }

    let dataUrl
    const fileName = `chat-bubble-${Date.now()}.${exportFormat}`
    toast({ title: "Exporting...", description: `Generating ${exportFormat.toUpperCase()} image.` })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (exportFormat) {
        case "png":
          dataUrl = await toPng(nodeToExport, { ...options, backgroundColor: "transparent" })
          break
        case "jpeg":
          dataUrl = await toJpeg(nodeToExport, { ...options, quality: 0.98, backgroundColor: "#FFFFFF" })
          break
        case "svg":
          dataUrl = await toSvg(nodeToExport, { ...options })
          break
        default:
          toast({ title: "Export Error", description: "Invalid export format.", variant: "destructive" })
          if (exportFormat === "jpeg") nodeToExport.style.backgroundColor = originalBg
          setIsExporting(false)
          return
      }

      setExportedImageData(dataUrl)
      setExportedImageUrl(dataUrl)

      const link = document.createElement("a")
      link.download = fileName
      link.href = dataUrl
      link.click()

      toast({
        title: "Export Successful",
        description: `${fileName} downloaded and image data is now available for scraping!`,
      })
    } catch (err) {
      console.error("Failed to export image:", err)
      toast({
        title: "Export Failed",
        description:
          "Could not generate image. If using an image URL, ensure it's accessible. Check console for details.",
        variant: "destructive",
      })
    } finally {
      if (exportFormat === "jpeg") {
        nodeToExport.style.backgroundColor = originalBg
      }
      setIsExporting(false)
    }
  }, [exportFormat, toast])

  const copyImageData = () => {
    if (exportedImageData) {
      navigator.clipboard
        .writeText(exportedImageData)
        .then(() => {
          toast({ title: "Copied!", description: "Image data (base64) copied to clipboard." })
        })
        .catch(() => {
          toast({ title: "Copy Failed", description: "Could not copy image data.", variant: "destructive" })
        })
    }
  }

  const handleNumberInputChange =
    (setter: React.Dispatch<React.SetStateAction<number>>, min = 0, max = 360) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = Number.parseInt(e.target.value, 10)
      if (isNaN(value)) value = min
      setter(Math.max(min, Math.min(max, value)))
    }

  const handleProfilePicFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicFile(event.target.files[0])
      setProfilePicUrl("")
    } else {
      setProfilePicFile(null)
    }
  }

  const getBubbleStyles = (): React.CSSProperties => {
    const baseRadPx = `${cornerRadius}px`
    const styles: React.CSSProperties = {
      padding: `${padding}px`,
      maxWidth: "320px",
      minWidth: "80px",
      boxSizing: "border-box",
      opacity: bubbleOpacity,
      position: "relative",
      wordBreak: "break-word",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }

    if (boxShadowEnabled) {
      styles.boxShadow = `${boxShadowOffsetX}px ${boxShadowOffsetY}px ${boxShadowBlur}px ${boxShadowSpread}px ${boxShadowColor}`
    } else {
      styles.boxShadow = "none"
    }

    if (backgroundType === "solid") {
      styles.backgroundColor = bubbleBgColor1
    } else if (backgroundType === "linear-gradient") {
      styles.backgroundImage = `linear-gradient(${gradientAngle}deg, ${bubbleBgColor1}, ${bubbleBgColor2})`
    } else if (backgroundType === "radial-gradient") {
      styles.backgroundImage = `radial-gradient(circle, ${bubbleBgColor1}, ${bubbleBgColor2})`
    }

    if (bubbleShape === "oval") {
      styles.borderRadius = "50%"
    } else if (bubbleShape === "rectangle") {
      styles.borderTopLeftRadius = baseRadPx
      styles.borderTopRightRadius = baseRadPx
      styles.borderBottomLeftRadius = baseRadPx
      styles.borderBottomRightRadius = baseRadPx
      if (bubbleStyle === "square") {
        const squareRadius = "8px"
        styles.borderTopLeftRadius = squareRadius
        styles.borderTopRightRadius = squareRadius
        styles.borderBottomLeftRadius = squareRadius
        styles.borderBottomRightRadius = squareRadius
      } else {
        if (tailPosition !== "none") {
          const tailRadValue = bubbleStyle === "chatApp" ? "6px" : `${Math.max(0, cornerRadius * 0.35)}px`
          if (tailPosition === "topLeft") styles.borderTopLeftRadius = tailRadValue
          else if (tailPosition === "topRight") styles.borderTopRightRadius = tailRadValue
          else if (tailPosition === "bottomLeft") styles.borderBottomLeftRadius = tailRadValue
          else if (tailPosition === "bottomRight") styles.borderBottomRightRadius = tailRadValue
        }
      }
    } else {
      styles.borderTopLeftRadius = baseRadPx
      styles.borderTopRightRadius = baseRadPx
      styles.borderBottomLeftRadius = baseRadPx
      styles.borderBottomRightRadius = baseRadPx
    }

    return styles
  }

  const currentProfilePicToDisplay = profilePicEnabled ? profilePicPreview : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Card className="w-full max-w-7xl mx-auto shadow-2xl rounded-2xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
          <CardTitle className="text-center text-4xl sm:text-5xl font-black text-white flex items-center justify-center tracking-tight">
            <Sparkles className="mr-4 h-10 w-10 animate-pulse" />
            Chat Bubble Studio
            <Sparkles className="ml-4 h-10 w-10 animate-pulse" />
          </CardTitle>
          <CardDescription className="text-center text-indigo-100 mt-3 text-lg font-medium">
            Create stunning, customizable chat bubbles with professional-grade controls
          </CardDescription>
          <div className="flex justify-center mt-4 gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Eye className="w-3 h-3 mr-1" />
              Live Preview
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Download className="w-3 h-3 mr-1" />
              Export Ready
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <ImageIconLucide className="w-3 h-3 mr-1" />
              Scrape Friendly
            </Badge>
          </div>
        </CardHeader>

        <div className="lg:grid lg:grid-cols-12 min-h-[70vh]">
          {/* Controls Panel */}
          <div className="lg:col-span-5 xl:col-span-4 p-6 space-y-6 border-r border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 overflow-y-auto max-h-[80vh] lg:max-h-[calc(100vh-200px)]">
            {/* Preset Themes */}
            <div className="mb-6">
              <Label className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <Palette className="mr-2 h-5 w-5 text-indigo-600" />
                Quick Themes
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_THEMES.map((theme, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPresetTheme(theme)}
                    className="h-12 text-xs font-medium border-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                    style={{
                      background:
                        theme.backgroundType === "linear-gradient"
                          ? `linear-gradient(${theme.gradientAngle}deg, ${theme.bubbleBgColor1}, ${theme.bubbleBgColor2})`
                          : theme.bubbleBgColor1,
                      color: "white",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>

            <Accordion
              type="multiple"
              className="w-full space-y-2"
              defaultValue={["bubble-content-settings", "profile-pic-settings", "appearance-settings"]}
            >
              <AccordionItem
                value="bubble-content-settings"
                className="border border-slate-200 rounded-xl bg-white shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline py-4 px-4 hover:bg-slate-50 data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-700 rounded-t-xl transition-all duration-200 group">
                  <span className="flex items-center">
                    <MessageSquareText className="mr-3 h-5 w-5 text-slate-600 group-data-[state=open]:text-indigo-600" />
                    Content & Text
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-4 space-y-4 text-sm bg-slate-50/30">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-slate-700 font-semibold text-sm mb-2 block">
                        Display Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter display name"
                        className="h-10 border-2 border-slate-200 focus:border-indigo-400 rounded-lg"
                      />
                      <Select value={nameTextAlign} onValueChange={(v) => setNameTextAlign(v as TextAlign)}>
                        <SelectTrigger className="h-9 text-xs mt-2 border-slate-200">
                          <SelectValue placeholder="Text alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">← Left</SelectItem>
                          <SelectItem value="center">↔ Center</SelectItem>
                          <SelectItem value="right">→ Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-slate-700 font-semibold text-sm mb-2 block">
                        Bio/Status
                      </Label>
                      <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Short bio or status"
                        className="h-10 border-2 border-slate-200 focus:border-indigo-400 rounded-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-slate-700 font-semibold text-sm mb-2 block">
                        Message Content
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here..."
                        className="min-h-[80px] border-2 border-slate-200 focus:border-indigo-400 rounded-lg resize-none"
                      />
                      <Select value={messageTextAlign} onValueChange={(v) => setMessageTextAlign(v as TextAlign)}>
                        <SelectTrigger className="h-9 text-xs mt-2 border-slate-200">
                          <SelectValue placeholder="Text alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">← Left</SelectItem>
                          <SelectItem value="center">↔ Center</SelectItem>
                          <SelectItem value="right">→ Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="profile-pic-settings"
                className="border border-slate-200 rounded-xl bg-white shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline py-4 px-4 hover:bg-slate-50 data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-700 rounded-t-xl transition-all duration-200 group">
                  <span className="flex items-center">
                    <UserCircle className="mr-3 h-5 w-5 text-slate-600 group-data-[state=open]:text-indigo-600" />
                    Profile Picture
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-4 space-y-4 text-sm bg-slate-50/30">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                    <Switch
                      id="profilePicEnabled"
                      checked={profilePicEnabled}
                      onCheckedChange={setProfilePicEnabled}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                    <Label htmlFor="profilePicEnabled" className="text-sm font-medium text-slate-700">
                      Enable Profile Picture
                    </Label>
                  </div>
                  {profilePicEnabled && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="profilePicUrl"
                          className="flex items-center text-sm font-medium text-slate-700 mb-2"
                        >
                          <Link2 className="mr-2 h-4 w-4" /> Image URL
                        </Label>
                        <Input
                          id="profilePicUrl"
                          type="url"
                          value={profilePicUrl}
                          onChange={(e) => {
                            setProfilePicUrl(e.target.value)
                            setProfilePicFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="h-10 border-2 border-slate-200 focus:border-indigo-400 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="profilePicFile"
                          className="flex items-center text-sm font-medium text-slate-700 mb-2"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" /> Upload File
                        </Label>
                        <Input
                          id="profilePicFile"
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleProfilePicFileChange}
                          className="h-10 border-2 border-slate-200 focus:border-indigo-400 rounded-lg file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-slate-600 font-medium">Border Width</Label>
                          <Input
                            type="number"
                            value={profilePicBorderWidth}
                            onChange={handleNumberInputChange(setProfilePicBorderWidth, 0, 10)}
                            className="h-9 mt-1 border-slate-200"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600 font-medium">Border Color</Label>
                          <Input
                            type="color"
                            value={profilePicBorderColor}
                            onChange={(e) => setProfilePicBorderColor(e.target.value)}
                            className="h-9 p-1 mt-1 border-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="appearance-settings"
                className="border border-slate-200 rounded-xl bg-white shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline py-4 px-4 hover:bg-slate-50 data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-700 rounded-t-xl transition-all duration-200 group">
                  <span className="flex items-center">
                    <Paintbrush className="mr-3 h-5 w-5 text-slate-600 group-data-[state=open]:text-indigo-600" />
                    Styling & Effects
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-4 space-y-4 text-sm bg-slate-50/30">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Background Type</Label>
                      <Select value={backgroundType} onValueChange={(v) => setBackgroundType(v as BackgroundType)}>
                        <SelectTrigger className="h-10 border-2 border-slate-200 focus:border-indigo-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">🎨 Solid Color</SelectItem>
                          <SelectItem value="linear-gradient">📐 Linear Gradient</SelectItem>
                          <SelectItem value="radial-gradient">⭕ Radial Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 font-medium">
                          {backgroundType === "solid" ? "Color" : "Color 1"}
                        </Label>
                        <Input
                          type="color"
                          value={bubbleBgColor1}
                          onChange={(e) => setBubbleBgColor1(e.target.value)}
                          className="h-12 p-1 mt-1 border-2 border-slate-200 rounded-lg"
                        />
                      </div>
                      {backgroundType !== "solid" && (
                        <div>
                          <Label className="text-xs text-slate-600 font-medium">Color 2</Label>
                          <Input
                            type="color"
                            value={bubbleBgColor2}
                            onChange={(e) => setBubbleBgColor2(e.target.value)}
                            className="h-12 p-1 mt-1 border-2 border-slate-200 rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {backgroundType === "linear-gradient" && (
                      <div>
                        <Label className="text-xs text-slate-600 font-medium">Gradient Angle: {gradientAngle}°</Label>
                        <Input
                          type="range"
                          min="0"
                          max="360"
                          value={gradientAngle}
                          onChange={(e) => setGradientAngle(Number(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 font-medium">Name Color</Label>
                        <Input
                          type="color"
                          value={nameTextColor}
                          onChange={(e) => setNameTextColor(e.target.value)}
                          className="h-10 p-1 mt-1 border-slate-200"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 font-medium">Message Color</Label>
                        <Input
                          type="color"
                          value={messageTextColor}
                          onChange={(e) => setMessageTextColor(e.target.value)}
                          className="h-10 p-1 mt-1 border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Switch
                          id="boxShadowEnabled"
                          checked={boxShadowEnabled}
                          onCheckedChange={setBoxShadowEnabled}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                        <Label htmlFor="boxShadowEnabled" className="text-sm font-medium text-slate-700">
                          Drop Shadow
                        </Label>
                      </div>
                      {boxShadowEnabled && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-slate-600">Blur: {boxShadowBlur}px</Label>
                            <Input
                              type="range"
                              min="0"
                              max="50"
                              value={boxShadowBlur}
                              onChange={(e) => setBoxShadowBlur(Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Offset Y: {boxShadowOffsetY}px</Label>
                            <Input
                              type="range"
                              min="-20"
                              max="30"
                              value={boxShadowOffsetY}
                              onChange={(e) => setBoxShadowOffsetY(Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="layout-settings" className="border border-slate-200 rounded-xl bg-white shadow-sm">
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline py-4 px-4 hover:bg-slate-50 data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-700 rounded-t-xl transition-all duration-200 group">
                  <span className="flex items-center">
                    <Settings className="mr-3 h-5 w-5 text-slate-600 group-data-[state=open]:text-indigo-600" />
                    Layout & Shape
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-4 space-y-4 text-sm bg-slate-50/30">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-600 font-medium">Padding: {padding}px</Label>
                      <Input
                        type="range"
                        min="8"
                        max="40"
                        value={padding}
                        onChange={(e) => setPadding(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 font-medium">Radius: {cornerRadius}px</Label>
                      <Input
                        type="range"
                        min="0"
                        max="50"
                        value={cornerRadius}
                        onChange={(e) => setCornerRadius(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-600 font-medium">Name Size: {fontSizeName}px</Label>
                      <Input
                        type="range"
                        min="10"
                        max="24"
                        value={fontSizeName}
                        onChange={(e) => setFontSizeName(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 font-medium">Message Size: {fontSizeMessage}px</Label>
                      <Input
                        type="range"
                        min="12"
                        max="28"
                        value={fontSizeMessage}
                        onChange={(e) => setFontSizeMessage(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="w-full h-12 mt-6 border-2 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium bg-transparent"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset All Settings
            </Button>
          </div>

          {/* Preview & Export Section */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                <Eye className="mr-3 h-7 w-7 text-indigo-600" /> Live Preview
              </h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="h-11 text-sm flex-grow sm:flex-grow-0 sm:w-[140px] bg-white border-2 border-slate-200 focus:border-indigo-400">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">🖼️ PNG</SelectItem>
                    <SelectItem value="jpeg">📷 JPEG</SelectItem>
                    <SelectItem value="svg">🎨 SVG</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleExport}
                  className="h-11 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex-grow sm:flex-grow-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={(!name.trim() && !message.trim()) || isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Export Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Export Results */}
            {exportedImageUrl && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Export Successful!</span>
                  </div>
                  <Button
                    onClick={copyImageData}
                    size="sm"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Data
                  </Button>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ Image downloaded to your device</p>
                  <p>✅ Base64 data ready for scraping</p>
                  <p>✅ Image URL available in browser memory</p>
                </div>
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <Label className="text-xs font-medium text-green-800 mb-1 block">
                    Scrapeable Image Data (Base64):
                  </Label>
                  <div className="text-xs font-mono text-green-700 bg-green-50 p-2 rounded border max-h-20 overflow-y-auto break-all">
                    {exportedImageData?.substring(0, 100)}...
                  </div>
                </div>
              </div>
            )}

            <div
              className={`flex-grow p-8 bg-white border-2 border-slate-200 rounded-2xl min-h-[500px] lg:min-h-[calc(75vh-200px)] flex items-center justify-center overflow-auto shadow-inner relative ${
                animationStyle === "fadeIn"
                  ? "animate-in fade-in duration-500"
                  : animationStyle === "slideUp"
                    ? "animate-in slide-in-from-bottom-4 duration-500"
                    : ""
              }`}
            >
              <div
                ref={exportNodeRef}
                style={{
                  display: "inline-flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "20px",
                  background: "transparent",
                }}
                className="transition-all duration-300 ease-out hover:scale-105"
              >
                {profilePicEnabled && currentProfilePicToDisplay && (
                  <img
                    key={currentProfilePicToDisplay}
                    src={currentProfilePicToDisplay || "/placeholder.svg"}
                    alt="Profile"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      borderWidth:
                        profilePicEnabled && profilePicBorderWidth > 0 ? `${profilePicBorderWidth}px` : "0px",
                      borderStyle: profilePicEnabled && profilePicBorderWidth > 0 ? profilePicBorderStyle : "none",
                      borderColor:
                        profilePicEnabled && profilePicBorderWidth > 0 ? profilePicBorderColor : "transparent",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    crossOrigin={profilePicFile ? undefined : "anonymous"}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = `/placeholder.svg?width=56&height=56&query=Profile`
                    }}
                  />
                )}
                <div style={getBubbleStyles()}>
                  {name.trim() && (
                    <p
                      className="font-bold tracking-tight"
                      style={{
                        color: nameTextColor,
                        fontSize: `${fontSizeName}px`,
                        lineHeight: `${fontSizeName * 1.2}px`,
                        marginBottom: bio.trim() || message.trim() ? "6px" : "0px",
                        textAlign: nameTextAlign,
                      }}
                    >
                      {name}
                    </p>
                  )}
                  {bio.trim() && (
                    <p
                      className="whitespace-pre-wrap font-medium opacity-90"
                      style={{
                        color: bioTextColor,
                        fontSize: `${bioFontSize}px`,
                        lineHeight: `${bioFontSize * 1.3}px`,
                        marginBottom: message.trim() ? "8px" : "0px",
                        textAlign: bioTextAlign,
                      }}
                    >
                      {bio}
                    </p>
                  )}
                  {message.trim() && (
                    <p
                      className="whitespace-pre-wrap leading-relaxed"
                      style={{
                        color: messageTextColor,
                        fontSize: `${fontSizeMessage}px`,
                        lineHeight: `${fontSizeMessage * 1.4}px`,
                        textAlign: messageTextAlign,
                      }}
                    >
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-center border-t border-slate-700">
          <p className="text-sm text-slate-300 w-full font-medium">
            Chat Bubble Gen by DeLunox
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
