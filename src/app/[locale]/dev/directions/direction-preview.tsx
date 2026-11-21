"use client";

import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { designAttributes, designStyle } from "@/components/layout/brand-style";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Direction } from "./directions";

/**
 * One direction rendered with the project's real components (components/ui),
 * inside a scope that carries the direction's knobs. What you see here is
 * exactly what the app becomes when these values go into src/config/design.ts.
 */
export function DirectionPreview({ direction }: { direction: Direction }) {
  const { design, primary } = direction;
  const [liked, setLiked] = useState(0);
  const scope = {
    ...designStyle(design),
    "--brand": primary.light,
    "--brand-dark": primary.dark,
  } as CSSProperties;
  const id = `dir-${direction.id}`;

  return (
    <div
      data-design
      {...designAttributes(design)}
      style={scope}
      className="grid gap-8 rounded-[calc(var(--radius)*1.6)] border bg-background p-5 text-foreground sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <div className="flex flex-wrap gap-3">
            <Button>Get started</Button>
            <Button variant="outline" effect="beam">
              Learn more
            </Button>
            <Button variant="secondary">Later</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" effect="shine">
              <Sparkles aria-hidden="true" />
              Shine CTA
            </Button>
            <Button size="lg" variant="ghost" className="group/arrow">
              Ghost
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-(--motion-base) group-hover/arrow:translate-x-0.5 rtl:rotate-180"
              />
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input id={`${id}-email`} type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id={`${id}-switch`} defaultChecked />
              <Label htmlFor={`${id}-switch`}>Reminders</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-check`} defaultChecked />
              <Label htmlFor={`${id}-check`}>Remember me</Label>
            </div>
          </div>
        </div>

        <div className="grid content-start gap-6">
          <Card interactive>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-0.5">
                  <CardTitle>Ayesha Khan</CardTitle>
                  <CardDescription>Product designer · Dhaka</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Star aria-hidden="true" className="size-3 fill-warning text-warning" />
                  4.9
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Hover the card: it lifts by the elevation knob. The like button pops.
            </CardContent>
            <CardFooter className="gap-3">
              <Button className="flex-1">Book a call</Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Like"
                aria-pressed={liked % 2 === 1}
                onClick={() => setLiked((n) => n + 1)}
              >
                <Heart
                  key={liked}
                  aria-hidden="true"
                  className={cn(liked % 2 === 1 && "animate-pop fill-destructive text-destructive")}
                />
              </Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-2 text-muted-foreground">
              The pill slides with the motion knob.
            </TabsContent>
            <TabsContent value="reviews" className="p-2 text-muted-foreground">
              Reviews panel
            </TabsContent>
            <TabsContent value="pricing" className="p-2 text-muted-foreground">
              Pricing panel
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
