import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-provider"

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme()

  const [selectedTheme, setSelectedTheme] = useState(theme)

  const handleThemeChange = (value: "light" | "dark") => {
    setSelectedTheme(value)
  }

  const handleUpdateTheme = () => {
    setTheme(selectedTheme)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-base font-semibold">Theme</h4>
        <p className="text-sm text-muted-foreground">
          Select the theme for the dashboard.
        </p>
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeChange}
          className="flex flex-col md:flex-row items-start gap-4 pt-2"
        >
          <div className="w-full md:w-auto">
            <Label className="cursor-pointer">
              <RadioGroupItem value="light" className="sr-only" />
              <div 
                className={`items-center rounded-xl border-2 p-3 transition-all duration-200 ${
                  selectedTheme === "light" 
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                <div className="space-y-3 rounded-lg bg-[#ecedef] p-3">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#cbd5e1]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#cbd5e1]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#cbd5e1]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#cbd5e1]" />
                  </div>
                </div>
              </div>
              <p className={`block w-full p-2 text-center font-medium mt-2 ${
                selectedTheme === "light" ? "text-primary" : "text-muted-foreground"
              }`}>
                {/* Light */}
              </p>
            </Label>
          </div>
          <div className="w-full md:w-auto">
            <Label className="cursor-pointer">
              <RadioGroupItem value="dark" className="sr-only" />
              <div 
                className={`items-center rounded-xl border-2 p-3 transition-all duration-200 ${
                  selectedTheme === "dark" 
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                <div className="space-y-3 rounded-lg bg-slate-950 p-3">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-600" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-600" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-600" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-600" />
                  </div>
                </div>
              </div>
              <p className={`block w-full p-2 text-center font-medium mt-2 ${
                selectedTheme === "dark" ? "text-primary" : "text-muted-foreground"
              }`}>
                {/* Dark */}
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="button"
        onClick={handleUpdateTheme}
      >
        Update preferences
      </Button>
    </div>
  )
}