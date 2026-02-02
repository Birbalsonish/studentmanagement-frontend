"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {  useNavigate } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  expandedItems = [],
  setExpandedItems,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  expandedItems?: string[]
  setExpandedItems?: (items: string[]) => void
}) {
  const navigate = useNavigate()

  const handleToggle = (title: string, isOpen: boolean) => {
    if (!setExpandedItems) return;
    
    if (isOpen) {
      setExpandedItems([...expandedItems, title]);
    } else {
      setExpandedItems(expandedItems.filter(item => item !== title));
    }
  };

  const handleNavClick = (url: string) => {
    navigate(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // If item has NO subitems, render as direct link
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  onClick={() => handleNavClick(item.url)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // If item HAS subitems, render with Collapsible dropdown
          return (
            <Collapsible
              key={item.title}
              asChild
              open={expandedItems.includes(item.title)}
              onOpenChange={(isOpen) => handleToggle(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild
                          onClick={() => handleNavClick(subItem.url)}
                          className="cursor-pointer"
                        >
                          <div>
                            <span>{subItem.title}</span>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}