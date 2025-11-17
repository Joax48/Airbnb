
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
│     │  ├─ jwtAuth.controller.js
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
│     │  ├─ jwtAuth.routes.js
│     │  ├─ property.js
│     │  ├─ resources.js
│     │  ├─ saved.js
│     │  ├─ service.js
│     │  ├─ upload.js
│     │  └─ user.routes.js
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
│  │  │  │  └─ ServiceForm.jsx
│  │  │  ├─ modals
│  │  │  │  ├─ HostModal.jsx
│  │  │  │  └─ LogInModal.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ ResourceCarousel.jsx
│  │  │  ├─ ResourceDetail.jsx
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
│  │  │  ├─ Extras
│  │  │  │  └─ NotFound.jsx
│  │  │  ├─ Home
│  │  │  │  └─ Home.jsx
│  │  │  ├─ Resources
│  │  │  │  ├─ AccommodationsPage.jsx
│  │  │  │  ├─ Activity.jsx
│  │  │  │  ├─ ActivityDetail.jsx
│  │  │  │  ├─ Property.jsx
│  │  │  │  ├─ PropertyDetail.jsx
│  │  │  │  ├─ Service.jsx
│  │  │  │  └─ ServiceDetail.jsx
│  │  │  └─ User
│  │  │     ├─ MyResources.jsx
│  │  │     └─ saved.jsx
│  │  ├─ style
│  │  │  ├─ AccommodationForm.css
│  │  │  ├─ AccomodationsPage.css
│  │  │  ├─ ActivityForm.css
│  │  │  ├─ AdminLayout.css
│  │  │  ├─ ApprovalButtons.css
│  │  │  ├─ Approvals.css
│  │  │  ├─ BackButton.css
│  │  │  ├─ Card.css
│  │  │  ├─ EmptyState.css
│  │  │  ├─ ErrorBlock.css
│  │  │  ├─ HomePage.css
│  │  │  ├─ HostModal.css
│  │  │  ├─ LogInModal.css
│  │  │  ├─ MyResources.css
│  │  │  ├─ Navbar.css
│  │  │  ├─ NotFound.css
│  │  │  ├─ Pagination.css
│  │  │  ├─ PendingCard.css
│  │  │  ├─ ResourceCarousel.css
│  │  │  ├─ ResourceDetail.css
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
└─ README.md

```