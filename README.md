
```
Airbnb
├─ backend
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ cloudinary.js
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ activity.js
│     │  ├─ amenities.js
│     │  ├─ approval.controller.js
│     │  ├─ auditLog.controller.js
│     │  ├─ bookings.js
│     │  ├─ jwtAuth.controller.js
│     │  ├─ payment.js
│     │  ├─ property.js
│     │  ├─ resources.js
│     │  ├─ saved.js
│     │  ├─ service.js
│     │  ├─ upload.js
│     │  ├─ userLogin.controller.js
│     │  └─ users.controller.js
│     ├─ middleware
│     │  ├─ jwt.auth.js
│     │  └─ verifyRole.js
│     ├─ routes
│     │  ├─ activity.js
│     │  ├─ admin.users.routes.js
│     │  ├─ amenities.js
│     │  ├─ approval.routes.js
│     │  ├─ bookings.js
│     │  ├─ jwtAuth.routes.js
│     │  ├─ payment.js
│     │  ├─ property.js
│     │  ├─ resources.js
│     │  ├─ saved.js
│     │  ├─ service.js
│     │  ├─ upload.js
│     │  └─ user.routes.js
│     ├─ securebnb.crt
│     ├─ securebnb.key
│     ├─ server.js
│     └─ utils
│        ├─ actor.js
│        └─ audit.js
├─ CONTRIBUTING.md
├─ frontend
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  └─ approvalsClient.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ images
│  │  │     ├─ host-activity.jpg
│  │  │     ├─ host-home.jpg
│  │  │     └─ host-service.jpg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ ApprovalButtons.jsx
│  │  │  │  ├─ ApproveConfirmDialog.jsx
│  │  │  │  ├─ EmptyState.jsx
│  │  │  │  ├─ ErrorBlock.jsx
│  │  │  │  ├─ LogsTable.jsx
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  ├─ PendingActivityCard.jsx
│  │  │  │  ├─ PendingPropertyCard.jsx
│  │  │  │  ├─ PendingServiceCard.jsx
│  │  │  │  ├─ RoleFilter.jsx
│  │  │  │  ├─ Toolbar.jsx
│  │  │  │  └─ UsersTable.jsx
│  │  │  ├─ BackButton.jsx
│  │  │  ├─ Container.jsx
│  │  │  ├─ forms
│  │  │  │  ├─ AccommodationForm.jsx
│  │  │  │  ├─ ActivityForm.jsx
│  │  │  │  ├─ PaymentForm.jsx
│  │  │  │  └─ ServiceForm.jsx
│  │  │  ├─ modals
│  │  │  │  ├─ HostModal.jsx
│  │  │  │  └─ LogInModal.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ ReservationSummary.jsx
│  │  │  ├─ ResourceCarousel.jsx
│  │  │  ├─ SearchBar.jsx
│  │  │  └─ SectionCarousel.jsx
│  │  ├─ hooks
│  │  │  ├─ useApprovals.js
│  │  │  ├─ useAuditLogsQuery.js
│  │  │  ├─ useAuth.js
│  │  │  ├─ useSaved.js
│  │  │  └─ useUsersQuery.js
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  └─ AdminLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ Approvals.jsx
│  │  │  │  ├─ Logs.jsx
│  │  │  │  └─ Users.jsx
│  │  │  ├─ Checkout
│  │  │  │  └─ Checkout.jsx
│  │  │  ├─ Extras
│  │  │  │  └─ NotFound.jsx
│  │  │  ├─ Home
│  │  │  │  └─ Home.jsx
│  │  │  ├─ Resources
│  │  │  │  ├─ ActivitiesPage.jsx
│  │  │  │  ├─ Activity.jsx
│  │  │  │  ├─ ActivityDetail.jsx
│  │  │  │  ├─ PropertiesPage.jsx
│  │  │  │  ├─ Property.jsx
│  │  │  │  ├─ PropertyDetail.jsx
│  │  │  │  ├─ ResourceListPage.jsx
│  │  │  │  ├─ Service.jsx
│  │  │  │  ├─ ServiceDetail.jsx
│  │  │  │  └─ ServicesPage.jsx
│  │  │  └─ User
│  │  │     ├─ MyBookings.jsx
│  │  │     ├─ MyResources.jsx
│  │  │     └─ saved.jsx
│  │  ├─ style
│  │  │  ├─ AccommodationForm.css
│  │  │  ├─ AccommodationsPage.css
│  │  │  ├─ ActivityForm.css
│  │  │  ├─ AdminLayout.css
│  │  │  ├─ ApprovalButtons.css
│  │  │  ├─ Approvals.css
│  │  │  ├─ BackButton.css
│  │  │  ├─ Card.css
│  │  │  ├─ Checkout.css
│  │  │  ├─ CheckoutForm.css
│  │  │  ├─ EmptyState.css
│  │  │  ├─ ErrorBlock.css
│  │  │  ├─ HomePage.css
│  │  │  ├─ HostModal.css
│  │  │  ├─ LogInModal.css
│  │  │  ├─ MyBookings.css
│  │  │  ├─ MyResources.css
│  │  │  ├─ Navbar.css
│  │  │  ├─ NotFound.css
│  │  │  ├─ Pagination.css
│  │  │  ├─ PendingCard.css
│  │  │  ├─ ReservationSummary.css
│  │  │  ├─ ResourceCarousel.css
│  │  │  ├─ ResourceDetail.css
│  │  │  ├─ ResourceListPage.css
│  │  │  ├─ RoleFilter.css
│  │  │  ├─ Saved.css
│  │  │  ├─ SearchBar.css
│  │  │  ├─ SectionCarousel.css
│  │  │  ├─ ServiceForm.css
│  │  │  ├─ Toolbar.css
│  │  │  ├─ Users.css
│  │  │  └─ UsersTable.css
│  │  └─ utils
│  │     ├─ AdminRoute.jsx
│  │     └─ ProtectedRoute.jsx
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ yubi.txt

```