# Todo Application

یک اپلیکیشن مدیریت وظایف پیشرفته ساخته شده با React، TypeScript و Tailwind CSS.

## ویژگی‌ها

### ✨ عملکردهای اصلی
- **مشاهده Todos**: نمایش لیست Todos از API
- **افزودن Todo**: فرم اعتبارسنجی شده با Zod
- **حذف Todo**: با تأیید کاربر
- **تغییر وضعیت**: علامت‌گذاری به عنوان تکمیل شده/ناتمام
- **Drag & Drop**: تغییر ترتیب Todos

### 🎨 ویژگی‌های اضافی
- **فیلتر کردن**: بر اساس وضعیت (همه، تکمیل شده، ناتمام)
- **جستجو**: جستجو در متن Todos
- **نوار پیشرفت**: نمایش درصد تکمیل
- **انیمیشن‌ها**: انیمیشن‌های نرم و زیبا
- **طراحی واکنش‌گرا**: سازگار با تمام دستگاه‌ها

## تکنولوژی‌های استفاده شده

### Frontend
- **React 19** - کتابخانه UI
- **TypeScript** - تایپ‌های ایمن
- **Tailwind CSS** - فریم‌ورک CSS
- **Redux Toolkit** - مدیریت state
- **React Query** - مدیریت داده‌ها و کش

### Backend Integration
- **DummyJSON API** - API تست
- **Fetch API** - درخواست‌های HTTP

### Validation & Error Handling
- **Zod** - اعتبارسنجی schema
- **Error Boundaries** - مدیریت خطاها
- **Toast Notifications** - اعلان‌های کاربر

## ساختار پروژه

```
src/
├── components/          # کامپوننت‌های UI
│   ├── TodoApp.tsx     # کامپوننت اصلی
│   ├── TodoItem.tsx    # آیتم Todo
│   ├── TodoList.tsx    # لیست Todos
│   ├── AddTodoForm.tsx # فرم افزودن
│   ├── TodoFilters.tsx # فیلترها
│   └── ErrorBoundary.tsx # مدیریت خطا
├── services/           # سرویس‌ها (MVC)
│   ├── apiProxy.ts     # ماژول API
│   ├── mapper.ts       # تبدیل داده‌ها
│   └── todoService.ts  # سرویس Todo
├── store/              # Redux Store
│   ├── store.ts        # تنظیمات Store
│   └── todoSlice.ts    # Slice Todo
├── types/              # تعاریف TypeScript
│   ├── todo.ts         # انواع Todo
│   └── validation.ts   # Schema های Zod
├── hooks/              # Custom Hooks
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
└── utils/              # توابع کمکی
    └── todoUtils.ts    # توابع Todo
```

## معماری MVC

این پروژه از الگوی MVC استفاده می‌کند:

### Model
- **Types**: تعاریف TypeScript
- **Validation**: Schema های Zod
- **Store**: Redux state management

### View
- **Components**: کامپوننت‌های React
- **UI**: Tailwind CSS styling
- **Layout**: Responsive design

### Controller
- **Services**: منطق کسب و کار
- **API Proxy**: مدیریت درخواست‌ها
- **Hooks**: Custom React hooks

## نصب و اجرا

### پیش‌نیازها
- Node.js (نسخه 16 یا بالاتر)
- npm یا yarn

### نصب وابستگی‌ها
```bash
npm install
```

### اجرای پروژه
```bash
npm start
```

### ساخت نسخه تولید
```bash
npm run build
```

### اجرای تست‌ها
```bash
npm test
```

## API Endpoints

- `GET /todos` - دریافت همه Todos
- `POST /todos/add` - افزودن Todo جدید
- `PUT /todos/{id}` - به‌روزرسانی Todo
- `DELETE /todos/{id}` - حذف Todo

## ویژگی‌های UI/UX

### طراحی مدرن
- رنگ‌بندی زیبا و هماهنگ
- انیمیشن‌های نرم
- آیکون‌های SVG
- فونت‌های خوانا

### تجربه کاربری
- Drag & Drop آسان
- فیلترهای سریع
- جستجوی لحظه‌ای
- بازخورد بصری

### واکنش‌گرایی
- سازگار با موبایل
- طراحی تطبیقی
- Touch-friendly
- Keyboard navigation

## مدیریت خطا

- **Error Boundaries**: مدیریت خطاهای React
- **API Error Handling**: مدیریت خطاهای شبکه
- **Validation Errors**: نمایش خطاهای اعتبارسنجی
- **User Feedback**: پیام‌های خطای واضح

## عملکرد

- **React Query**: کش هوشمند
- **Optimistic Updates**: به‌روزرسانی فوری UI
- **Lazy Loading**: بارگذاری بهینه
- **Debounced Search**: جستجوی بهینه

## تست

- **Unit Tests**: تست کامپوننت‌ها
- **Integration Tests**: تست سرویس‌ها
- **E2E Tests**: تست کامل کاربری

## مشارکت

1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات را commit کنید
4. Push کنید
5. Pull Request ایجاد کنید

## لایسنس

MIT License

## نویسنده

ساخته شده با ❤️ و React + TypeScript
