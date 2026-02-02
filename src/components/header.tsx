import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/common/useTheme";

const breadcrumbMap: Record<string, { parent?: string; current: string }> = {
  "/dashboard": { current: "Dashboard" },
  "/students": { current: "All Students" },
  "/students/grades": { parent: "Students", current: "Grades" },
  "/students/results": { parent: "Students", current: "Results" },
  "/students/enrollments": { parent: "Students", current: "Enrollments" },
  "/teachers": { current: "Teachers" },
  "/classes": { current: "All Classes" },
  "/subjects": { parent: "Classes", current: "Subjects" },
  "/attendance": { current: "Attendance" },
  "/fees": { current: "Fees" },
  "/settings": { current: "Settings" },
};

function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const breadcrumb = breadcrumbMap[location.pathname] || { current: "Page" };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.parent && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/${breadcrumb.parent.toLowerCase()}`}>
                    {breadcrumb.parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumb.current}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Button variant="outline" onClick={toggleTheme} className="mr-4">
        {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </Button>
    </header>
  );
}

export default Header;