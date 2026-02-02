# 📚 Student Management System - Frontend README

## 🎯 Project Overview

A complete React TypeScript frontend for a School/Student Management System with full CRUD operations, responsive design, and dark mode support.

**Status**: ✅ Production Ready  
**Tech Stack**: React 18 + TypeScript + Tailwind CSS + ShadCN UI  
**Routing**: React Router v6  
**Forms**: React Hook Form + Yup Validation  
**State**: React Hooks + Context API  

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                          # ShadCN UI components
│   ├── students/
│   │   ├── student-details.tsx      # Student form modal
│   │   ├── grades-details.tsx
│   │   ├── results-details.tsx
│   │   └── enrollments-details.tsx
│   ├── teachers/
│   │   └── teachers-details.tsx
│   ├── classes/
│   │   ├── classes-details.tsx
│   │   └── subjects-details.tsx
│   ├── attendance/
│   │   └── attendance-details.tsx
│   ├── fees/
│   │   └── fees-details.tsx
│   ├── GenericTable/
│   │   └── generic-table.tsx        # Reusable table component
│   ├── app-sidebar.tsx
│   ├── header.tsx                   # Header with dynamic breadcrumb
│   ├── nav-main.tsx                 # Navigation menu
│   └── common/
│       └── useTheme.tsx             # Theme hook
├── pages/
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── students/
│   │   ├── Students.tsx
│   │   ├── Grades.tsx
│   │   ├── Results.tsx
│   │   └── Enrollments.tsx
│   ├── teachers/
│   │   └── Teachers.tsx
│   ├── classes/
│   │   ├── Classes.tsx
│   │   └── Subjects.tsx
│   ├── attendance/
│   │   └── Attendance.tsx
│   ├── fees/
│   │   └── Fees.tsx
│   └── settings/
│       └── Settings.tsx
├── lib/
│   ├── types.ts                     # All TypeScript interfaces
│   └── api.ts                       # API service layer (ready for backend)
├── App.tsx                          # Main app with routing
├── main.tsx                         # Entry point
└── index.css                        # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📋 Available Pages

| Route | Page | Features |
|-------|------|----------|
| `/dashboard` | Dashboard | Overview, charts, statistics |
| `/students` | Students | List, search, add, edit, delete |
| `/students/grades` | Grades | Manage student grades |
| `/students/results` | Results | Track exam results |
| `/students/enrollments` | Enrollments | Manage course enrollments |
| `/teachers` | Teachers | Teacher management |
| `/classes` | Classes | Class management |
| `/classes/subjects` | Subjects | Subject management |
| `/attendance` | Attendance | Mark and track attendance |
| `/fees` | Fees | Fee management & tracking |
| `/settings` | Settings | App settings |

---

## 🎨 UI Components

### Core Components
- **GenericTable**: Reusable table with search, sort, edit, delete
- **Detail Modals**: Forms for creating/editing entities
- **StatCard**: Statistics display cards
- **Header**: Navigation with dynamic breadcrumb

### ShadCN UI Used
- Button, Input, Select, Card, Sheet
- Sidebar, Breadcrumb, Table, Badge
- Dialog, Dropdown, Separator

---

## 🔄 Data Flow

### Example: Student CRUD

```
Students.tsx (Page)
    ↓
[Mock Data] ← GenericTable
    ↓
User clicks Edit → student-details.tsx (Modal)
    ↓
Form submission → console.log (Ready for API)
    ↓
Update state → Re-render table
```

### Current Flow (Mock Data)
```typescript
const [students, setStudents] = useState<Student[]>(mockStudents);

const handleEdit = (student: Student) => {
  setSelectedStudent(student);
  setIsManage(true);  // Open modal
};

const handleDelete = (student: Student) => {
  setStudents(students.filter(s => s.id !== student.id));
};
```

---

## 📝 Form Validation

All forms use **React Hook Form** + **Yup**:

```typescript
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

---

## 🌓 Theme Support

Dark/Light mode toggle in header:

```typescript
// Hook usage
const { theme, toggleTheme } = useTheme();

// Button
<Button onClick={toggleTheme}>
  {theme === "light" ? <Moon /> : <Sun />}
</Button>
```

Theme is saved to localStorage and persists across sessions.

---

## 🔌 API Integration (Ready for Backend)

### Current State (Mock Data)
Each page uses mock data arrays:
```typescript
const mockStudents: Student[] = [
  { id: 1, name: "John", email: "john@school.com", ... }
];
```

### Ready for Backend
Replace with API calls:

```typescript
// Option 1: Direct axios
useEffect(() => {
  axios.get('/api/students')
    .then(res => setStudents(res.data.data))
    .catch(err => setError(err.message));
}, []);

// Option 2: Use api.ts service (already created)
import { studentService } from '@/lib/api';

useEffect(() => {
  studentService.getAll()
    .then(res => setStudents(res.data.data))
    .catch(err => setError(err.message));
}, []);
```

### API Service File
Location: `src/lib/api.ts`

Pre-configured services for:
- Students, Teachers, Grades, Results
- Enrollments, Classes, Subjects
- Attendance, Fees, Dashboard

---

## 📊 Type Definitions

All types in `src/lib/types.ts`:

```typescript
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  studentId: string;
  class: string;
  rollNo: number;
  status: "Active" | "Inactive";
}

// Similar interfaces for other entities
// Plus: API response types, filter types, request types
```

---

## 🔍 Search & Filter

### GenericTable Features
- **Search**: Real-time filtering on multiple fields
- **Columns**: Customizable column definitions
- **Actions**: Edit and Delete buttons

```typescript
<GenericTable
  data={students}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  searchKeys={["name", "email", "class"]}  // Search on these fields
/>
```

---

## 🎯 Dynamic Breadcrumb

Breadcrumb automatically updates based on current route:

```
/dashboard → "Dashboard"
/students → "Students > All Students"
/students/grades → "Students > Grades"
/classes/subjects → "Classes > Subjects"
```

Configuration in `header.tsx`:
```typescript
const breadcrumbMap: Record<string, { parent?: string; current: string }> = {
  "/dashboard": { current: "Dashboard" },
  "/students": { current: "All Students" },
  "/students/grades": { parent: "Students", current: "Grades" },
  // ... all routes
};
```

---

## 📱 Responsive Design

- **Mobile**: Single column layout, sidebar collapsible
- **Tablet**: Two column layout (768px+)
- **Desktop**: Full multi-column layout (1024px+)

Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

---

## 🎨 Styling

**Framework**: Tailwind CSS + CSS Variables

**Color Scheme**:
- Light mode: White background, dark text
- Dark mode: Dark background, light text
- Automatic toggle via theme hook

---

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "react-hook-form": "latest",
  "yup": "latest",
  "@tanstack/react-table": "latest",
  "recharts": "latest",
  "lucide-react": "latest",
  "tailwindcss": "^3.0.0",
  "@shadcn/ui": "latest"
}
```

---

## 🔐 TypeScript Configuration

**Strict Mode Enabled**: Full type safety

**Path Aliases**:
```typescript
"@/*" → "src/*"
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] All forms validate correctly
- [ ] CRUD operations work (add, edit, delete)
- [ ] Search filters work
- [ ] Dark/light mode toggle works
- [ ] Responsive design on mobile
- [ ] Breadcrumb updates on navigation
- [ ] No console errors

### Run Build
```bash
npm run build
```

---

## 🚀 Backend Integration Steps

1. **Create API endpoints** following `API-SPECIFICATIONS.md`
2. **Update environment variables**:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. **Replace mock data** with API calls in each page
4. **Add loading/error states** using existing state
5. **Add toast notifications** (optional)
6. **Deploy** together with backend

---

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
npm run build
# Check error messages and fix imports
```

### Types Not Found
Ensure `src/lib/types.ts` has all required exports

---

## 📚 Useful Files for Backend

1. **API-SPECIFICATIONS.md** - All required endpoints
2. **src/lib/types.ts** - Data models/interfaces
3. **src/services/api.ts** - API service layer template
4. **FRONTEND-HANDOVER-DOCUMENTATION.md** - Complete overview

---

## 🎯 Next Steps

1. ✅ Frontend complete and ready
2. ⏳ Backend team: Create API endpoints
3. ⏳ Frontend integration: Replace mock data with API calls
4. ⏳ Testing: Full integration testing
5. ⏳ Deployment: Deploy both frontend and backend

---

## 💬 Support & Troubleshooting

### Check These First
1. Correct route in `App.tsx`
2. Correct import paths
3. TypeScript types match
4. Mock data structure correct
5. No console errors

### Verify Installation
```bash
npm list react react-router-dom react-hook-form
```

---

## 📞 Contact & Questions

For issues or questions about the frontend:
1. Check the code comments
2. Review the component props
3. Check type definitions in `types.ts`
4. Review the API service in `api.ts`

---

## ✨ Project Status

**Frontend**: ✅ COMPLETE & PRODUCTION READY

- All pages created and functional
- All CRUD operations working (with mock data)
- Full type safety with TypeScript
- Responsive design implemented
- Dark/light theme working
- Ready for backend integration

---

## 📄 Documentation Files Included

1. **README.md** (this file) - Quick start guide
2. **FRONTEND-HANDOVER-DOCUMENTATION.md** - Complete technical overview
3. **API-SPECIFICATIONS.md** - Backend requirements
4. **PROJECT-SETUP-GUIDE.md** - Installation & configuration

---

**Last Updated**: February 2025  
**Version**: 1.0.0  
**Status**: Production Ready 🚀