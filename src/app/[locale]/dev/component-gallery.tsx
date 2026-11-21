"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TOAST_POSITIONS } from "@/config";

const SPECIES = { cat: "Cat", dog: "Dog", bird: "Bird" };

/** Every interactive primitive in its animated states. Development only (/dev). */
export function ComponentGallery() {
  return (
    <TooltipProvider>
      <div className="grid gap-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="dev-name">Input</Label>
            <Input id="dev-name" placeholder="Pet name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dev-species">Select</Label>
            <Select items={SPECIES} defaultValue="cat">
              <SelectTrigger id="dev-species" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SPECIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="dev-note">Textarea</Label>
            <Textarea id="dev-note" placeholder="What's wrong?" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="dev-switch" defaultChecked />
            <Label htmlFor="dev-switch">Switch (spring thumb)</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="dev-check" />
            <Label htmlFor="dev-check">Checkbox</Label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book a visit?</DialogTitle>
                <DialogDescription>Fades and scales in, closes faster than it opens.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <DialogClose render={<Button>Confirm</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger render={<Button variant="outline">Popover</Button>} />
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Popover</PopoverTitle>
                <PopoverDescription>Grows from its trigger.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Notifications">
                  <Bell aria-hidden="true" />
                </Button>
              }
            />
            <TooltipContent>Tooltip</TooltipContent>
          </Tooltip>

          <Avatar>
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <Badge>Verified</Badge>
          <Badge variant="secondary">Sponsored</Badge>
          <Badge variant="outline">New</Badge>
        </div>

        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-2 text-sm text-muted-foreground">
            Tabs: the active pill moves between triggers.
          </TabsContent>
          <TabsContent value="reviews" className="p-2 text-sm text-muted-foreground">
            Reviews panel
          </TabsContent>
          <TabsContent value="hours" className="p-2 text-sm text-muted-foreground">
            Hours panel
          </TabsContent>
        </Tabs>

        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Toast at any position (default: features.toaster.position)
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => toast.success("Saved")}>
              success
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.error("Payment failed")}>
              error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                  loading: "Booking…",
                  success: "Booked",
                  error: "Failed",
                })
              }
            >
              promise
            </Button>
            {TOAST_POSITIONS.map((position) => (
              <Button key={position} size="sm" variant="ghost" onClick={() => toast(position, { position })}>
                {position}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
