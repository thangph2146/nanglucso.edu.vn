'use strict';

// This file defines the specific data for the course mindmap
// and initializes it using the generic mindmap component from js/components/mindmap.js

const actualCourseData = [
    {
        id: null, text: "<b>Tất cả<br>Khóa học</b>",
        href: "/tat-ca-khoa-hoc",
        iconClass: 'bi bi-collection-play-fill', description: "Khám phá toàn bộ lộ trình học tập tại trung tâm."
        // 'collapsed' property will be automatically added and defaulted to false by initMindmap
    },
    // --- Lập trình Web Cơ bản ---
    {
        id: 'course1', parentId: null, text: "Lập trình Web<br>Cơ bản",
        href: "/khoa-hoc/lap-trinh-web-co-ban",
        iconClass: 'bi bi-code-slash', description: "Nền tảng vững chắc cho người mới bắt đầu với phát triển web hiện đại."
    },
    {
        id: 'course1_1', parentId: 'course1', text: "HTML & CSS<br>Nền tảng",
        href: "/khoa-hoc/lap-trinh-web-co-ban/html-css-nen-tang",
        iconClass: 'bi bi-filetype-html', description: "Xây dựng cấu trúc và giao diện website từ cơ bản đến nâng cao."
    },
    {
        id: 'course1_2', parentId: 'course1', text: "JavaScript<br>Căn bản",
        href: "/khoa-hoc/lap-trinh-web-co-ban/javascript-can-ban",
        iconClass: 'bi bi-filetype-js', description: "Làm chủ ngôn ngữ lập trình phổ biến nhất cho web, tạo tương tác động."
    },
    {
        id: 'course1_3', parentId: 'course1', text: "ReactJS<br>Cho người mới",
        href: "/khoa-hoc/lap-trinh-web-co-ban/reactjs-cho-nguoi-moi",
        iconClass: 'bi bi-bootstrap-reboot', description: "Xây dựng giao diện người dùng hiện đại với thư viện ReactJS mạnh mẽ."
    },
    // --- Phân tích Dữ liệu ---
    {
        id: 'course2', parentId: null, text: "Phân tích<br>Dữ liệu",
        href: "/khoa-hoc/phan-tich-du-lieu",
        iconClass: 'bi bi-bar-chart-line-fill', description: "Khai phá kiến thức và đưa ra quyết định dựa trên dữ liệu thực tế."
    },
    {
        id: 'course2_1', parentId: 'course2', text: "Nhập môn<br>Khoa học Dữ liệu",
        href: "/khoa-hoc/phan-tich-du-lieu/nhap-mon-khoa-hoc-du-lieu",
        iconClass: 'bi bi-calculator-fill', description: "Tổng quan về quy trình và công cụ trong khoa học dữ liệu."
    },
    {
        id: 'course2_2', parentId: 'course2', text: "Python cho<br>Phân tích Dữ liệu",
        href: "/khoa-hoc/phan-tich-du-lieu/python-cho-phan-tich-du-lieu",
        iconClass: 'bi bi-filetype-py', description: "Sử dụng Python và các thư viện (Pandas, NumPy) để xử lý dữ liệu."
    },
    {
        id: 'course2_3', parentId: 'course2', text: "Trực quan hóa<br>Dữ liệu với Power BI",
        href: "/khoa-hoc/phan-tich-du-lieu/truc-quan-hoa-power-bi",
        iconClass: 'bi bi-easel2-fill', description: "Tạo báo cáo và dashboard tương tác với công cụ Power BI hàng đầu."
    },
    // --- Thiết kế UI/UX ---
    {
        id: 'course3', parentId: null, text: "Thiết kế<br>UI/UX Chuyên nghiệp",
        href: "/khoa-hoc/thiet-ke-ui-ux-chuyen-nghiep",
        iconClass: 'bi bi-palette-fill', description: "Tạo ra trải nghiệm người dùng tối ưu và giao diện thu hút, thân thiện."
    },
    {
        id: 'course3_1', parentId: 'course3', text: "Nguyên lý<br>Thiết kế UI/UX",
        href: "/khoa-hoc/thiet-ke-ui-ux-chuyen-nghiep/nguyen-ly-thiet-ke",
        iconClass: 'bi bi-lightbulb-fill', description: "Hiểu rõ các nguyên tắc cốt lõi để tạo sản phẩm số hiệu quả."
    },
    {
        id: 'course3_2', parentId: 'course3', text: "Figma:<br>Thiết kế và Prototype",
        href: "/khoa-hoc/thiet-ke-ui-ux-chuyen-nghiep/figma-thiet-ke-prototype",
        iconClass: 'bi bi-figma', description: "Làm chủ công cụ Figma để thiết kế giao diện và tạo mẫu thử tương tác."
    },
    {
        id: 'course3_3', parentId: 'course3', text: "Kiểm thử<br>Trải nghiệm Người dùng",
        href: "/khoa-hoc/thiet-ke-ui-ux-chuyen-nghiep/kiem-thu-trai-nghiem",
        iconClass: 'bi bi-patch-check-fill', description: "Phương pháp thu thập phản hồi và cải thiện thiết kế dựa trên người dùng."
    },
    // --- Tài chính Ngân hàng Số ---
    {
        id: 'course4', parentId: null, text: "Tài chính<br>Ngân hàng Số (Fintech)",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so",
        iconClass: 'bi bi-bank2', description: "Nắm bắt công nghệ và xu hướng đột phá trong ngành tài chính hiện đại."
    },
    {
        id: 'course4_1', parentId: 'course4', text: "Tổng quan<br>về Fintech",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so/tong-quan-fintech",
        iconClass: 'bi bi-credit-card-2-front-fill', description: "Hiểu về các mô hình kinh doanh và công nghệ mới trong Fintech."
    },
    {
        id: 'course4_2', parentId: 'course4', text: "Blockchain và<br>Tiền điện tử cơ bản",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so/blockchain-tien-dien-tu",
        iconClass: 'bi bi-currency-bitcoin', description: "Giới thiệu về công nghệ blockchain và ứng dụng trong tài chính."
    },
    {
        id: 'course4_3', parentId: 'course4', text: "An toàn thông tin<br>trong Giao dịch số",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so/an-toan-thong-tin",
        iconClass: 'bi bi-shield-lock-fill', description: "Các biện pháp bảo mật và quản lý rủi ro trong tài chính số."
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