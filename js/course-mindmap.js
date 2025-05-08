'use strict';

// This file defines the specific data for the course mindmap
// and initializes it using the generic mindmap component from js/components/mindmap.js

const actualCourseData = [
    {
        id: null, text: "<b>Tất cả<br>Lĩnh vực Đào tạo</b>",
        href: "/tat-ca-khoa-hoc",
        iconClass: 'bi bi-mortarboard-fill', description: "Khám phá toàn bộ lộ trình học tập và phát triển kỹ năng tại trung tâm."
        // 'collapsed' property will be automatically added and defaulted to false by initMindmap
    },
    // --- Lập trình Web Cơ bản ---
    {
        id: 'course1', parentId: null, text: "Lập trình Web<br>Chuyên sâu",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau",
        iconClass: 'bi bi-braces', description: "Từ nền tảng đến kỹ thuật nâng cao trong phát triển web hiện đại."
    },
    {
        id: 'course1_1', parentId: 'course1', text: "HTML & CSS<br>Nền tảng",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/html-css-nen-tang",
        iconClass: 'bi bi-filetype-html', description: "Xây dựng cấu trúc và giao diện website từ cơ bản đến responsive."
    },
    {
        id: 'course1_2', parentId: 'course1', text: "JavaScript<br>Nâng cao",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/javascript-nang-cao",
        iconClass: 'bi bi-filetype-jsx', description: "ES6+, DOM, API, và các khái niệm JavaScript hiện đại."
    },
    {
        id: 'course1_2_1', parentId: 'course1_2', text: "Làm việc với API<br> (Fetch, Axios)",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/javascript-nang-cao/api-integration",
        iconClass: 'bi bi-cloud-download-fill', description: "Tích hợp dữ liệu từ các nguồn bên ngoài vào ứng dụng web."
    },
    {
        id: 'course1_3', parentId: 'course1', text: "ReactJS &<br>Hệ sinh thái",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/reactjs-ecosystem",
        iconClass: 'bi bi-react', description: "Xây dựng UI với React, Redux, Router và các thư viện phổ biến."
    },
    {
        id: 'course1_3_1', parentId: 'course1_3', text: "Quản lý State<br>với Redux/Context",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/reactjs-ecosystem/state-management",
        iconClass: 'bi bi-diagram-3-fill', description: "Các kỹ thuật quản lý trạng thái ứng dụng React phức tạp."
    },
    {
        id: 'course1_4', parentId: 'course1', text: "Node.js & Express<br>Backend cơ bản",
        href: "/khoa-hoc/lap-trinh-web-chuyen-sau/nodejs-express",
        iconClass: 'bi bi-hdd-network-fill', description: "Xây dựng API và backend cho ứng dụng web với Node.js."
    },
    // --- Phân tích Dữ liệu ---
    {
        id: 'course2', parentId: null, text: "Khoa học Dữ liệu<br>Ứng dụng",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung",
        iconClass: 'bi bi-clipboard-data-fill', description: "Biến dữ liệu thành thông tin chi tiết và lợi thế cạnh tranh."
    },
    {
        id: 'course2_1', parentId: 'course2', text: "Nhập môn<br>Khoa học Dữ liệu",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung/nhap-mon",
        iconClass: 'bi bi-calculator', description: "Tổng quan về quy trình, công cụ và ứng dụng của khoa học dữ liệu."
    },
    {
        id: 'course2_2', parentId: 'course2', text: "Python cho<br>Xử lý Dữ liệu",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung/python-xu-ly-du-lieu",
        iconClass: 'bi bi-filetype-py', description: "Sử dụng Pandas, NumPy để làm sạch, biến đổi và phân tích dữ liệu."
    },
    {
        id: 'course2_2_1', parentId: 'course2_2', text: "Kỹ thuật<br>Làm sạch Dữ liệu",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung/python-xu-ly-du-lieu/lam-sach-du-lieu",
        iconClass: 'bi bi-funnel', description: "Các phương pháp xử lý dữ liệu thiếu, nhiễu và không nhất quán."
    },
    {
        id: 'course2_3', parentId: 'course2', text: "Trực quan hóa<br>Dữ liệu Nâng cao",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung/truc-quan-hoa-nang-cao",
        iconClass: 'bi bi-graph-up-arrow', description: "Sử dụng Matplotlib, Seaborn, Power BI để tạo biểu đồ và dashboard hiệu quả."
    },
    {
        id: 'course2_4', parentId: 'course2', text: "Machine Learning<br>Cơ bản",
        href: "/khoa-hoc/khoa-hoc-du-lieu-ung-dung/machine-learning-co-ban",
        iconClass: 'bi bi-cpu-fill', description: "Giới thiệu về các thuật toán học máy và ứng dụng thực tế."
    },
    // --- Thiết kế UI/UX ---
    {
        id: 'course3', parentId: null, text: "Thiết kế<br>Sản phẩm Số (UI/UX)",
        href: "/khoa-hoc/thiet-ke-san-pham-so-ui-ux",
        iconClass: 'bi bi-gem', description: "Kiến tạo trải nghiệm người dùng đột phá và giao diện sản phẩm cuốn hút."
    },
    {
        id: 'course3_1', parentId: 'course3', text: "Nghiên cứu<br>Người dùng (UX Research)",
        href: "/khoa-hoc/thiet-ke-san-pham-so-ui-ux/ux-research",
        iconClass: 'bi bi-people', description: "Phương pháp thu thập insight và thấu hiểu nhu cầu người dùng."
    },
    {
        id: 'course3_2', parentId: 'course3', text: "Thiết kế UI với Figma<br>Từ A đến Z",
        href: "/khoa-hoc/thiet-ke-san-pham-so-ui-ux/figma-a-z",
        iconClass: 'bi bi-figma', description: "Làm chủ Figma: Design system, components, auto layout, prototyping."
    },
    {
        id: 'course3_2_1', parentId: 'course3_2', text: "Xây dựng<br>Design System",
        href: "/khoa-hoc/thiet-ke-san-pham-so-ui-ux/figma-a-z/design-system",
        iconClass: 'bi bi-columns-gap', description: "Tạo và quản lý thư viện UI nhất quán cho dự án lớn."
    },
    {
        id: 'course3_3', parentId: 'course3', text: "Interaction Design<br>& Prototyping Nâng cao",
        href: "/khoa-hoc/thiet-ke-san-pham-so-ui-ux/interaction-prototyping",
        iconClass: 'bi bi-magic', description: "Tạo mẫu thử tương tác phức tạp và hiệu ứng chuyển động mượt mà."
    },
    // --- Tài chính Ngân hàng Số ---
    {
        id: 'course4', parentId: null, text: "Công nghệ Tài chính<br>(Fintech) Toàn diện",
        href: "/khoa-hoc/cong-nghe-tai-chinh-fintech",
        iconClass: 'bi bi-cash-coin', description: "Khám phá sâu về công nghệ, ứng dụng và tương lai của ngành Fintech."
    },
    {
        id: 'course4_1', parentId: 'course4', text: "Tổng quan<br>Thị trường Fintech",
        href: "/khoa-hoc/cong-nghe-tai-chinh-fintech/tong-quan-fintech",
        iconClass: 'bi bi-bank', description: "Các mô hình kinh doanh, sản phẩm và xu hướng chủ đạo trong Fintech."
    },
    {
        id: 'course4_2', parentId: 'course4', text: "Blockchain<br>Ứng dụng Tài chính",
        href: "/khoa-hoc/cong-nghe-tai-chinh-fintech/blockchain-ung-dung",
        iconClass: 'bi bi-link-45deg', description: "Hợp đồng thông minh, DeFi, và các ứng dụng thực tiễn của Blockchain."
    },
    {
        id: 'course4_2_1', parentId: 'course4_2', text: "Phát triển<br>Hợp đồng thông minh",
        href: "/khoa-hoc/cong-nghe-tai-chinh-fintech/blockchain-ung-dung/smart-contract",
        iconClass: 'bi bi-file-earmark-code', description: "Giới thiệu về Solidity và phát triển DApps cơ bản."
    },
    {
        id: 'course4_3', parentId: 'course4', text: "Thanh toán số<br>và Ngân hàng mở",
        href: "/khoa-hoc/cong-nghe-tai-chinh-fintech/thanh-toan-so-open-banking",
        iconClass: 'bi bi-credit-card-2-back-fill', description: "Các giải pháp thanh toán hiện đại và xu thế Open Banking."
    },
    // --- Digital Marketing (NEW CATEGORY) ---
    {
        id: 'course5', parentId: null, text: "Digital Marketing<br>Tổng lực",
        href: "/khoa-hoc/digital-marketing-tong-luc",
        iconClass: 'bi bi-megaphone-fill', description: "Chiến lược và công cụ để thành công trong tiếp thị kỹ thuật số."
    },
    {
        id: 'course5_1', parentId: 'course5', text: "SEO & Content<br>Marketing Hiệu quả",
        href: "/khoa-hoc/digital-marketing-tong-luc/seo-content-marketing",
        iconClass: 'bi bi-search-heart', description: "Tối ưu hóa công cụ tìm kiếm và xây dựng nội dung thu hút khách hàng."
    },
    {
        id: 'course5_1_1', parentId: 'course5_1', text: "Nghiên cứu<br>Từ khóa Chuyên sâu",
        href: "/khoa-hoc/digital-marketing-tong-luc/seo-content-marketing/keyword-research",
        iconClass: 'bi bi-key-fill', description: "Công cụ và kỹ thuật để tìm kiếm và lựa chọn từ khóa chiến lược."
    },
    {
        id: 'course5_2', parentId: 'course5', text: "Quảng cáo trực tuyến<br>(Google Ads, Facebook Ads)",
        href: "/khoa-hoc/digital-marketing-tong-luc/quang-cao-truc-tuyen",
        iconClass: 'bi bi-badge-ad-fill', description: "Thiết lập và tối ưu hóa chiến dịch quảng cáo trên các nền tảng phổ biến."
    },
    {
        id: 'course5_3', parentId: 'course5', text: "Social Media<br>Marketing & Branding",
        href: "/khoa-hoc/digital-marketing-tong-luc/social-media-marketing",
        iconClass: 'bi bi-share-fill', description: "Xây dựng thương hiệu và tương tác với cộng đồng trên mạng xã hội."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Ensure initMindmap is available (it should be, if js/components/mindmap.js is loaded first)
    if (typeof initMindmap === 'function') {
        initMindmap('#mindmap-container', actualCourseData);
    } else {
        console.error('CRITICAL ERROR: initMindmap function is not defined. Please ensure js/components/mindmap.js is loaded in your HTML BEFORE js/course-mindmap.js.');
    }
}); 