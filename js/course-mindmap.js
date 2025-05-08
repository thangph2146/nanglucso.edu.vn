
const actualCourseData = [
    {
        id: null, text: "<b>Tất cả<br>Khóa học</b>",
        href: "/tat-ca-khoa-hoc",
        iconClass: 'bi bi-collection-play-fill', description: "Khám phá toàn bộ lộ trình học tập."
        // 'collapsed' property will be automatically added and defaulted to false by initMindmap
    },
    {
        id: 'course1', parentId: null, text: "Lập trình Web<br>Cơ bản",
        href: "/khoa-hoc/lap-trinh-web-co-ban",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course2', parentId: null, text: "Phân tích<br>Dữ liệu",
        href: "/khoa-hoc/phan-tich-du-lieu",
        iconClass: 'bi bi-bar-chart-line-fill', description: "Khai phá thông tin từ dữ liệu lớn."
    },
    {
        id: 'course3', parentId: null, text: "Thiết kế<br>UI/UX",
        href: "/khoa-hoc/thiet-ke-ui-ux",
        iconClass: 'bi bi-palette-fill', description: "Tạo giao diện người dùng đẹp và hiệu quả."
    },
    {
        id: 'course4', parentId: null, text: "Tài chính<br>Ngân hàng Số",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so",
        iconClass: 'bi bi-bank', description: "Công nghệ và xu hướng trong tài chính số."
    },
    // Sub-nodes for course1
    {
        id: 'course1_1', parentId: 'course1', text: "HTML & CSS<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/html-css-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng."
    },
    {
        id: 'course1_2', parentId: 'course1', text: "JavaScript<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/javascript-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Lập trình tương tác."
    },
    {
        id: 'course1_3', parentId: 'course1', text: "React<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/react-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Thư viện UI."
    },
    // Sub-nodes for course2
    {
        id: 'course2_1', parentId: 'course2', text: "Data Collection<br>and Cleaning",
        href: "/khoa-hoc/phan-tich-du-lieu/data-collection",
        iconClass: 'bi bi-funnel-fill', description: "Thu thập và làm sạch."
    },
    {
        id: 'course2_2', parentId: 'course2', text: "Statistical<br>Analysis",
        href: "/khoa-hoc/phan-tich-du-lieu/statistical-analysis",
        iconClass: 'bi bi-graph-up-arrow', description: "Phân tích thống kê."
    },
    {
        id: 'course2_3', parentId: 'course2', text: "Data<br>Visualization",
        href: "/khoa-hoc/phan-tich-du-lieu/data-visualization",
        iconClass: 'bi bi-pie-chart-fill', description: "Trực quan hóa dữ liệu."
    },
    // Sub-nodes for course3
    {
        id: 'course3_1', parentId: 'course3', text: "User Research<br>and Personas",
        href: "/khoa-hoc/thiet-ke-ui-ux/user-research",
        iconClass: 'bi bi-people-fill', description: "Nghiên cứu người dùng."
    },
    {
        id: 'course3_2', parentId: 'course3', text: "Wireframing<br>and Prototyping",
        href: "/khoa-hoc/thiet-ke-ui-ux/wireframing-prototyping",
        iconClass: 'bi bi-bounding-box-circles', description: "Tạo khung và mẫu thử."
    },
    {
        id: 'course3_3', parentId: 'course3', text: "Visual Design<br>and UI Kits",
        href: "/khoa-hoc/thiet-ke-ui-ux/visual-design",
        iconClass: 'bi bi-palette2', description: "Thiết kế trực quan."
    }
    // Add more nodes for course4 or other top-level/sub-nodes as needed
];

document.addEventListener('DOMContentLoaded', () => {
    // Ensure initMindmap is available (it should be, if js/components/mindmap.js is loaded first)
    if (typeof initMindmap === 'function') {
        initMindmap('#mindmap-container', actualCourseData);
    } else {
        console.error('CRITICAL ERROR: initMindmap function is not defined. Please ensure js/components/mindmap.js is loaded in your HTML BEFORE js/course-mindmap.js.');
    }
}); 