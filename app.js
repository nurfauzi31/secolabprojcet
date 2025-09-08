// SecoLab Learning Management System
document.addEventListener('DOMContentLoaded', function() {
    // Application State
    const appState = {
        currentView: 'dashboard',
        isLoggedIn: false,
        currentLanguage: 'id',
        user: {
            name: 'Ir. Jenderal Wito',
            email: 'wito@secolab.edu',
            role: 'Guru',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            class: 'Matematika',
            favoriteSubjects: ['Matematika', 'Fisika'],
            workHistory: ['Mengajar di SMAN 1 Jakarta (2020-sekarang)', 'Dosen Tamu di UI (2019-2020)'],
            joinDate: '2020-08-15'
        },
        dashboard: {
            stats: {
                activeClasses: [
                    { id: 1, name: '10-A Matematika', students: 32, progress: 75 },
                    { id: 2, name: '10-B Matematika', students: 30, progress: 68 },
                    { id: 3, name: '11-A Matematika', students: 28, progress: 82 },
                    { id: 4, name: '11-B Matematika', students: 29, progress: 71 }
                ],
                totalStudents: 119,
                runningProjects: { notStarted: 15, inProgress: 23, completed: 42 },
                completedTasks: { notStarted: 8, inProgress: 17, completed: 35 }
            }
        },
        students: [
            { id: 1, name: 'Ahmad Budiman', class: '10-A', grade: 88, major: 'ipa', subjects: { matematika: 85, fisika: 82, kimia: 90, biologi: 86 }},
            { id: 2, name: 'Siti Nurhaliza', class: '10-A', grade: 92, major: 'ipa', subjects: { matematika: 95, fisika: 89, kimia: 94, biologi: 90 }},
            { id: 3, name: 'Budi Santoso', class: '10-B', grade: 78, major: 'ips', subjects: { ekonomi: 80, sosiologi: 76, geografi: 78, antropologi: 77 }},
            { id: 4, name: 'Dewi Lestari', class: '10-B', grade: 85, major: 'ips', subjects: { ekonomi: 87, sosiologi: 83, geografi: 85, antropologi: 86 }}
        ],
        materials: {
            umum: [
                { id: 1, title: 'Bahasa Indonesia - Teks Eksposisi.pdf', subject: 'Bahasa Indonesia', type: 'pdf', uploadDate: '2025-01-15', downloads: 45 },
                { id: 2, title: 'English Grammar Basics.pptx', subject: 'Bahasa Inggris', type: 'pptx', uploadDate: '2025-01-12', downloads: 38 }
            ],
            mipa: [
                { id: 3, title: 'Kalkulus Diferensial.pdf', subject: 'Matematika', type: 'pdf', uploadDate: '2025-01-10', downloads: 52 },
                { id: 4, title: 'Hukum Newton - Simulasi.mp4', subject: 'Fisika', type: 'video', uploadDate: '2025-01-08', downloads: 67 }
            ],
            sosial: [
                { id: 5, title: 'Teori Ekonomi Makro.docx', subject: 'Ekonomi', type: 'docx', uploadDate: '2025-01-14', downloads: 29 },
                { id: 6, title: 'Pemetaan Sosial Masyarakat.pdf', subject: 'Sosiologi', type: 'pdf', uploadDate: '2025-01-11', downloads: 33 }
            ]
        },
        quizzes: [
            { id: 1, title: 'Kuis Aljabar Linear', subject: 'Matematika', type: 'individual', dueDate: '2025-01-25', status: 'active', responses: 28, total: 32 },
            { id: 2, title: 'Project Based Learning - Ekosistem', subject: 'Biologi', type: 'group', dueDate: '2025-01-30', status: 'scheduled', responses: 0, total: 32 },
            { id: 3, title: 'Ujian Tengah Semester', subject: 'Matematika', type: 'individual', dueDate: '2025-01-20', status: 'completed', responses: 32, total: 32 }
        ],
        forum: {
            topics: [
                { id: 1, title: 'Diskusi Materi Kalkulus Bab 3', subject: 'Matematika', author: 'Ahmad Budiman', replies: 15, lastActivity: '2 jam lalu' },
                { id: 2, title: 'Pertanyaan tentang Hukum Termodinamika', subject: 'Fisika', author: 'Siti Nurhaliza', replies: 8, lastActivity: '5 jam lalu' },
                { id: 3, title: 'Proyek Kelompok Analisis Pasar', subject: 'Ekonomi', author: 'Budi Santoso', replies: 23, lastActivity: '1 hari lalu' }
            ]
        },
        feedback: [],
        faqs: [
            { q: 'Bagaimana cara menggunakan fitur AI untuk membuat kelompok?', a: 'Masuk ke menu Buat Kelompok, pilih siswa yang ingin dikelompokkan, atur preferensi AI, lalu klik "Proses dengan AI". Sistem akan secara otomatis membuat kelompok yang optimal berdasarkan kriteria yang Anda tentukan.' },
            { q: 'Bisakah siswa mengakses materi yang telah diupload?', a: 'Ya, semua materi yang Anda upload akan otomatis tersedia untuk siswa di kelas terkait. Siswa dapat melihat, mengunduh, dan memberikan feedback pada materi tersebut.' },
            { q: 'Bagaimana cara melihat progress belajar siswa?', a: 'Anda dapat melihat progress siswa melalui Dashboard, bagian Analytics. Di sana tersedia berbagai grafik dan statistik yang menunjukkan performa individu maupun kelas secara keseluruhan.' }
        ],
        chartInstances: {},
        wizard: {
            currentStep: 0,
            steps: [
                { id: 0, title: 'Input Data' },
                { id: 1, title: 'Konfigurasi AI' },
                { id: 2, title: 'Proses AI' },
                { id: 3, title: 'Hasil & Kustomisasi' }
            ],
            selectedClass: '',
            selectedStudents: new Set(),
            aiConfig: { useAI: false, balanceGrades: 70, diverseSkills: 80, collaborationStyle: 60 },
            generatedGroups: [],
            projectName: 'Proyek Kelompok Baru'
        },
        projects: [],
        aiAssistant: {
            isOpen: false,
            messages: [
                { type: 'bot', text: 'Halo! Saya SiLab.ai, asisten pembelajaran Anda. Bagaimana saya bisa membantu Anda hari ini?', timestamp: new Date() }
            ],
            isTyping: false
        }
    };

    // Translation system
    const translations = {
        id: {
            welcome: 'Selamat Datang di',
            loginWithGoogle: 'Masuk dengan Google',
            register: 'Daftar',
            login: 'Masuk',
            dashboard: 'Dashboard',
            profile: 'Profil',
            management: 'Manajemen',
            materials: 'Materi Pelajaran',
            quiz: 'Kuis & Ujian',
            groups: 'Buat Kelompok',
            projects: 'Proyek & Tugas',
            forum: 'Forum Diskusi',
            calendar: 'Kalender',
            help: 'Pusat Bantuan'
        },
        en: {
            welcome: 'Welcome to',
            loginWithGoogle: 'Sign in with Google',
            register: 'Register',
            login: 'Login',
            dashboard: 'Dashboard',
            profile: 'Profile',
            management: 'Management',
            materials: 'Learning Materials',
            quiz: 'Quiz & Exams',
            groups: 'Create Groups',
            projects: 'Projects & Tasks',
            forum: 'Discussion Forum',
            calendar: 'Calendar',
            help: 'Help Center'
        }
    };

    // Initialize Application
    function init() {
        setupEventListeners();
        if (appState.isLoggedIn) {
            showMainApp();
        } else {
            showLoginPage();
        }
    }

    function setupEventListeners() {
        // Login page events
        document.getElementById('google-login-btn')?.addEventListener('click', handleGoogleLogin);
        document.getElementById('language-selector')?.addEventListener('change', handleLanguageChange);

        // Main app events
        document.getElementById('mobile-menu-button')?.addEventListener('click', toggleMobileMenu);
        document.getElementById('header-profile-btn')?.addEventListener('click', () => navigate('profile'));
        document.getElementById('profile-link')?.addEventListener('click', () => navigate('profile'));

        // AI Assistant events
        document.getElementById('ai-toggle')?.addEventListener('click', toggleAIChat);
        document.getElementById('close-ai-chat')?.addEventListener('click', closeAIChat);
        document.getElementById('send-ai-message')?.addEventListener('click', sendAIMessage);
        document.getElementById('ai-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });

        // Navigation events
        setupNavigation();
    }

    function setupNavigation() {
        const navContainers = [document.getElementById('main-nav')];
        
        navContainers.forEach(container => {
            if (!container) return;
            container.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.hash) {
                    e.preventDefault();
                    const view = link.hash.substring(1);
                    navigate(view);
                }
            });
        });
    }

    function handleGoogleLogin() {
        // Simulate Google login
        appState.isLoggedIn = true;
        showMainApp();
    }

    function handleLanguageChange(e) {
        appState.currentLanguage = e.target.value;
        updateLanguage();
    }

    function updateLanguage() {
        // Update language-specific content
        // This would typically involve updating all text elements
        console.log('Language updated to:', appState.currentLanguage);
    }

    function showLoginPage() {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    function showMainApp() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        navigate('dashboard');
    }

    function navigate(view) {
        appState.currentView = view;
        updateActiveNav();
        renderCurrentView();
        closeMobileMenu();
    }

    function updateActiveNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.hash === `#${appState.currentView}`);
        });
    }

    function renderCurrentView() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        destroyCharts();
        
        switch(appState.currentView) {
            case 'dashboard':
                renderDashboard(mainContent);
                break;
            case 'profile':
                renderProfile(mainContent);
                break;
            case 'kelas':
                renderManagement(mainContent);
                break;
            case 'materi':
                renderMaterials(mainContent);
                break;
            case 'kuis':
                renderQuizzes(mainContent);
                break;
            case 'buat-kelompok':
                renderGroupCreation(mainContent);
                break;
            case 'proyek':
                renderProjects(mainContent);
                break;
            case 'forum':
                renderForum(mainContent);
                break;
            case 'kalender':
                renderCalendar(mainContent);
                break;
            case 'bantuan':
                renderHelp(mainContent);
                break;
            default:
                mainContent.innerHTML = '<div class="text-center p-10"><h2 class="text-2xl font-bold text-slate-600">Halaman tidak ditemukan</h2></div>';
        }
    }

    function renderDashboard(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <div class="text-sm text-slate-500">
                        Terakhir diperbarui: ${new Date().toLocaleDateString('id-ID')}
                    </div>
                </div>

                <!-- Dashboard Submenu -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button class="dashboard-submenu bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all text-left" data-submenu="active-classes">
                        <div class="text-3xl mb-2">🏫</div>
                        <h3 class="font-bold text-lg">Kelas Aktif</h3>
                        <p class="text-2xl font-bold text-secolab">${appState.dashboard.stats.activeClasses.length}</p>
                        <p class="text-sm text-slate-500">Kelas yang diajar</p>
                    </button>
                    
                    <button class="dashboard-submenu bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all text-left" data-submenu="student-count">
                        <div class="text-3xl mb-2">👥</div>
                        <h3 class="font-bold text-lg">Jumlah Siswa</h3>
                        <p class="text-2xl font-bold text-secolab">${appState.dashboard.stats.totalStudents}</p>
                        <p class="text-sm text-slate-500">Total siswa</p>
                    </button>
                    
                    <button class="dashboard-submenu bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all text-left" data-submenu="running-projects">
                        <div class="text-3xl mb-2">📊</div>
                        <h3 class="font-bold text-lg">Proyek Berjalan</h3>
                        <p class="text-2xl font-bold text-secolab">${appState.dashboard.stats.runningProjects.inProgress}</p>
                        <p class="text-sm text-slate-500">Sedang dikerjakan</p>
                    </button>
                    
                    <button class="dashboard-submenu bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all text-left" data-submenu="completed-tasks">
                        <div class="text-3xl mb-2">✅</div>
                        <h3 class="font-bold text-lg">Tugas Selesai</h3>
                        <p class="text-2xl font-bold text-secolab">${appState.dashboard.stats.completedTasks.completed}</p>
                        <p class="text-sm text-slate-500">Tugas complete</p>
                    </button>
                </div>

                <!-- Dynamic Content Area -->
                <div id="dashboard-content" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 class="font-bold text-xl mb-4">Aktivitas Terbaru</h3>
                            <div class="space-y-3">
                                <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <p class="text-sm">Ahmad Budiman menyelesaikan Kuis Aljabar Linear</p>
                                    <span class="text-xs text-slate-500 ml-auto">2 jam lalu</span>
                                </div>
                                <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <p class="text-sm">Materi baru "Kalkulus Diferensial" diupload</p>
                                    <span class="text-xs text-slate-500 ml-auto">5 jam lalu</span>
                                </div>
                                <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <p class="text-sm">Kelompok 3 membutuhkan review untuk proyek</p>
                                    <span class="text-xs text-slate-500 ml-auto">1 hari lalu</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 class="font-bold text-xl mb-4">Saran dari AI ✨</h3>
                            <div class="space-y-3">
                                <div class="p-3 bg-secolab-light rounded-lg">
                                    <p class="text-sm">💡 Siswa di kelas 10-A menunjukkan peningkatan signifikan dalam matematika. Pertimbangkan memberikan tantangan tambahan.</p>
                                </div>
                                <div class="p-3 bg-yellow-50 rounded-lg">
                                    <p class="text-sm">⚠️ Kelompok 2 terlihat kesulitan dengan proyek fisika. Mungkin perlu bimbingan ekstra.</p>
                                </div>
                                <div class="p-3 bg-green-50 rounded-lg">
                                    <p class="text-sm">🎉 Tingkat partisipasi forum diskusi meningkat 40% minggu ini!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for dashboard submenus
        container.addEventListener('click', (e) => {
            const submenu = e.target.closest('.dashboard-submenu');
            if (submenu) {
                const submenuType = submenu.dataset.submenu;
                showDashboardSubmenu(submenuType);
            }
        });
    }

    function showDashboardSubmenu(type) {
        const content = document.getElementById('dashboard-content');
        if (!content) return;

        let html = '';
        switch(type) {
            case 'active-classes':
                html = `
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-xl">Kelas Aktif</h3>
                            <button class="text-sm text-secolab hover:underline">Tambah Kelas Baru</button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${appState.dashboard.stats.activeClasses.map(cls => `
                                <div class="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer">
                                    <h4 class="font-semibold">${cls.name}</h4>
                                    <p class="text-sm text-slate-500">${cls.students} siswa</p>
                                    <div class="mt-2">
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-xs">Progress</span>
                                            <span class="text-xs font-bold text-green-600">${cls.progress}%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 rounded-full h-2">
                                            <div class="bg-green-500 h-2 rounded-full" style="width: ${cls.progress}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
            
            case 'student-count':
                html = `
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-xl">Daftar Siswa</h3>
                            <select id="class-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="">Semua Kelas</option>
                                <option value="10-A">10-A</option>
                                <option value="10-B">10-B</option>
                                <option value="11-A">11-A</option>
                                <option value="11-B">11-B</option>
                            </select>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="p-3 text-left">Nama</th>
                                        <th class="p-3 text-left">Kelas</th>
                                        <th class="p-3 text-left">Jurusan</th>
                                        <th class="p-3 text-left">Nilai Rata-rata</th>
                                    </tr>
                                </thead>
                                <tbody id="student-list">
                                    ${appState.students.map(student => `
                                        <tr class="border-b student-row" data-class="${student.class}">
                                            <td class="p-3 font-medium">${student.name}</td>
                                            <td class="p-3">${student.class}</td>
                                            <td class="p-3 uppercase">${student.major}</td>
                                            <td class="p-3 font-bold text-secolab">${student.grade}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                break;
            
            case 'running-projects':
                html = `
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-xl">Proyek Berjalan</h3>
                            <div class="flex space-x-2">
                                <select id="project-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                    <option value="all">Semua Status</option>
                                    <option value="notStarted">Belum Dikerjakan</option>
                                    <option value="inProgress">Sedang Dikerjakan</option>
                                    <option value="completed">Sudah Dikerjakan</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="chart-container">
                                <canvas id="projectChart"></canvas>
                            </div>
                            <div class="space-y-3">
                                <h4 class="font-semibold">Detail Proyek</h4>
                                <div class="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Belum Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.runningProjects.notStarted}</span>
                                    </div>
                                </div>
                                <div class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Sedang Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.runningProjects.inProgress}</span>
                                    </div>
                                </div>
                                <div class="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Sudah Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.runningProjects.completed}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            
            case 'completed-tasks':
                html = `
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-xl">Tugas Kelompok - Status Penyelesaian</h3>
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="chart-container">
                                <canvas id="taskChart"></canvas>
                            </div>
                            <div class="space-y-3">
                                <h4 class="font-semibold">Ringkasan Tugas</h4>
                                <div class="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Belum Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.completedTasks.notStarted}</span>
                                    </div>
                                </div>
                                <div class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Sedang Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.completedTasks.inProgress}</span>
                                    </div>
                                </div>
                                <div class="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                                    <div class="flex justify-between">
                                        <span class="font-medium">Sudah Dikerjakan</span>
                                        <span class="font-bold">${appState.dashboard.stats.completedTasks.completed}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }

        content.innerHTML = html;

        // Setup additional event listeners and charts
        if (type === 'student-count') {
            const classFilter = document.getElementById('class-filter');
            if (classFilter) {
                classFilter.addEventListener('change', (e) => {
                    const filterClass = e.target.value;
                    const rows = document.querySelectorAll('.student-row');
                    rows.forEach(row => {
                        if (!filterClass || row.dataset.class === filterClass) {
                            row.classList.remove('hidden');
                        } else {
                            row.classList.add('hidden');
                        }
                    });
                });
            }
        }

        if (type === 'running-projects') {
            setTimeout(() => renderProjectChart(), 100);
        }

        if (type === 'completed-tasks') {
            setTimeout(() => renderTaskChart(), 100);
        }
    }

    function renderProfile(container) {
        container.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-6">Profil Saya</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Profile Card -->
                    <div class="lg:col-span-1">
                        <div class="bg-white p-6 rounded-xl shadow-sm border text-center">
                            <div class="relative inline-block mb-4">
                                <img src="${appState.user.avatar}" alt="Profile" class="w-24 h-24 rounded-full mx-auto shadow-lg">
                                <button class="absolute bottom-0 right-0 bg-secolab text-white p-2 rounded-full hover:bg-secolab-dark">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                    </svg>
                                </button>
                            </div>
                            <h3 class="text-xl font-bold">${appState.user.name}</h3>
                            <p class="text-slate-600">${appState.user.role}</p>
                            <p class="text-sm text-slate-500 mt-2">Bergabung ${new Date(appState.user.joinDate).toLocaleDateString('id-ID')}</p>
                            
                            <div class="mt-6 space-y-2 text-left">
                                <div class="flex items-center space-x-3">
                                    <span class="text-lg">📧</span>
                                    <span class="text-sm">${appState.user.email}</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="text-lg">🎓</span>
                                    <span class="text-sm">${appState.user.class}</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="text-lg">❤️</span>
                                    <span class="text-sm">${appState.user.favoriteSubjects.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl shadow-sm border mt-6">
                            <h4 class="font-bold text-lg mb-4">Grafik Kinerja</h4>
                            <div class="chart-container h-48">
                                <canvas id="performanceChart"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Profile Details -->
                    <div class="lg:col-span-2">
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-bold">Informasi Pribadi</h3>
                                <button id="edit-profile-btn" class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                                    Edit Profil
                                </button>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                                    <input type="text" value="${appState.user.name}" class="w-full border-slate-200 rounded-lg px-3 py-2" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input type="email" value="${appState.user.email}" class="w-full border-slate-200 rounded-lg px-3 py-2" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Kelas/Mata Pelajaran</label>
                                    <input type="text" value="${appState.user.class}" class="w-full border-slate-200 rounded-lg px-3 py-2" readonly>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Kata Sandi</label>
                                    <input type="password" value="••••••••" class="w-full border-slate-200 rounded-lg px-3 py-2" readonly>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran Kesukaan</label>
                                    <input type="text" value="${appState.user.favoriteSubjects.join(', ')}" class="w-full border-slate-200 rounded-lg px-3 py-2" readonly>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl shadow-sm border mt-6">
                            <h3 class="text-xl font-bold mb-4">Riwayat Pekerjaan</h3>
                            <div class="space-y-3">
                                ${appState.user.workHistory.map(work => `
                                    <div class="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                                        <div class="w-2 h-2 bg-secolab rounded-full mt-2"></div>
                                        <p class="text-sm">${work}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render performance chart
        setTimeout(() => {
            const ctx = document.getElementById('performanceChart')?.getContext('2d');
            if (ctx) {
                appState.chartInstances.performance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                        datasets: [{
                            label: 'Kinerja Mengajar',
                            data: [85, 89, 92, 87, 94, 91],
                            borderColor: '#1F8BC9',
                            backgroundColor: 'rgba(31, 139, 201, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: false, min: 80, max: 100 }
                        }
                    }
                });
            }
        }, 100);

        // Add edit profile event
        document.getElementById('edit-profile-btn')?.addEventListener('click', openEditProfileModal);
    }

    function renderManagement(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Manajemen</h1>
                </div>

                <!-- Management Tabs -->
                <div class="bg-white rounded-xl shadow-sm border mb-6">
                    <div class="border-b border-slate-200">
                        <nav class="flex space-x-8 px-6">
                            <button class="management-tab py-4 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-secolab hover:border-secolab active" data-tab="add-student">
                                Tambah Siswa
                            </button>
                            <button class="management-tab py-4 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-secolab hover:border-secolab" data-tab="student-list">
                                Daftar Siswa
                            </button>
                            <button class="management-tab py-4 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-secolab hover:border-secolab" data-tab="excel-upload">
                                Upload Excel
                            </button>
                        </nav>
                    </div>
                    
                    <div class="p-6">
                        <div id="management-content">
                            <!-- Dynamic content based on active tab -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for tabs
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('management-tab')) {
                const tabs = container.querySelectorAll('.management-tab');
                tabs.forEach(tab => {
                    tab.classList.remove('active', 'border-secolab', 'text-secolab');
                    tab.classList.add('border-transparent', 'text-slate-500');
                });
                
                e.target.classList.add('active', 'border-secolab', 'text-secolab');
                e.target.classList.remove('border-transparent', 'text-slate-500');
                
                showManagementTab(e.target.dataset.tab);
            }
        });

        // Show default tab
        showManagementTab('add-student');
    }

    function showManagementTab(tabName) {
        const content = document.getElementById('management-content');
        if (!content) return;

        switch(tabName) {
            case 'add-student':
                content.innerHTML = `
                    <div class="max-w-2xl">
                        <h3 class="text-lg font-bold mb-4">Tambah Siswa Baru</h3>
                        <form id="add-student-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                                    <input type="text" name="fullName" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Kelas</label>
                                    <select name="class" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                        <option value="">Pilih Kelas</option>
                                        <option value="10-A">10-A</option>
                                        <option value="10-B">10-B</option>
                                        <option value="11-A">11-A</option>
                                        <option value="11-B">11-B</option>
                                        <option value="12-A">12-A</option>
                                        <option value="12-B">12-B</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Jurusan</label>
                                <select name="major" id="major-select" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                    <option value="">Pilih Jurusan</option>
                                    <option value="ipa">IPA (Ilmu Pengetahuan Alam)</option>
                                    <option value="ips">IPS (Ilmu Pengetahuan Sosial)</option>
                                </select>
                            </div>

                            <div id="subjects-container" class="hidden">
                                <label class="block text-sm font-medium text-slate-700 mb-2">Nilai Mata Pelajaran</label>
                                <div id="subjects-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Dynamic subjects based on major selection -->
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" class="bg-secolab text-white px-6 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                                    Tambah Siswa
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                
                // Add event listener for major selection
                const majorSelect = document.getElementById('major-select');
                if (majorSelect) {
                    majorSelect.addEventListener('change', (e) => {
                        showSubjectsForMajor(e.target.value);
                    });
                }

                // Add form submit handler
                document.getElementById('add-student-form')?.addEventListener('submit', handleAddStudent);
                break;

            case 'student-list':
                content.innerHTML = `
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold">Daftar Siswa</h3>
                            <div class="flex space-x-2">
                                <input type="text" id="search-students" placeholder="Cari siswa..." class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <select id="filter-class" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                    <option value="">Semua Kelas</option>
                                    <option value="10-A">10-A</option>
                                    <option value="10-B">10-B</option>
                                    <option value="11-A">11-A</option>
                                    <option value="11-B">11-B</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="p-3 text-left">Nama</th>
                                        <th class="p-3 text-left">Kelas</th>
                                        <th class="p-3 text-left">Jurusan</th>
                                        <th class="p-3 text-left">Nilai Rata-rata</th>
                                        <th class="p-3 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="students-table-body">
                                    ${appState.students.map(student => `
                                        <tr class="border-b student-row hover:bg-slate-50" data-class="${student.class}" data-name="${student.name.toLowerCase()}">
                                            <td class="p-3 font-medium">${student.name}</td>
                                            <td class="p-3">${student.class}</td>
                                            <td class="p-3 uppercase">${student.major}</td>
                                            <td class="p-3 font-bold text-secolab">${student.grade}</td>
                                            <td class="p-3">
                                                <button class="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                                                <button class="text-red-600 hover:underline text-xs">Hapus</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                // Add search and filter functionality
                const searchInput = document.getElementById('search-students');
                const classFilter = document.getElementById('filter-class');
                
                function filterStudents() {
                    const searchTerm = searchInput.value.toLowerCase();
                    const selectedClass = classFilter.value;
                    const rows = document.querySelectorAll('.student-row');
                    
                    rows.forEach(row => {
                        const matchesSearch = !searchTerm || row.dataset.name.includes(searchTerm);
                        const matchesClass = !selectedClass || row.dataset.class === selectedClass;
                        
                        if (matchesSearch && matchesClass) {
                            row.classList.remove('hidden');
                        } else {
                            row.classList.add('hidden');
                        }
                    });
                }

                searchInput?.addEventListener('input', filterStudents);
                classFilter?.addEventListener('change', filterStudents);
                break;

            case 'excel-upload':
                content.innerHTML = `
                    <div class="max-w-2xl">
                        <h3 class="text-lg font-bold mb-4">Upload Data Siswa via Excel</h3>
                        <div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                            <div class="mb-4">
                                <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-medium text-slate-900 mb-2">Upload File Excel</h4>
                            <p class="text-sm text-slate-500 mb-4">Drag and drop file Excel atau klik untuk memilih file</p>
                            <input type="file" id="excel-file" accept=".xlsx,.xls" class="hidden">
                            <button id="select-file-btn" class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark">
                                Pilih File
                            </button>
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="font-medium text-slate-900 mb-2">Format Excel yang Diperlukan:</h4>
                            <div class="bg-slate-50 p-4 rounded-lg text-sm">
                                <p class="mb-2">Kolom yang harus ada dalam file Excel:</p>
                                <ul class="list-disc list-inside space-y-1 text-slate-600">
                                    <li>Nama Lengkap</li>
                                    <li>Kelas</li>
                                    <li>Jurusan (IPA/IPS)</li>
                                    <li>Nilai Mata Pelajaran (sesuai jurusan)</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 flex space-x-3">
                            <button class="text-sm text-secolab hover:underline">Download Template Excel</button>
                            <button class="text-sm text-slate-500 hover:underline">Lihat Contoh Data</button>
                        </div>
                    </div>
                `;

                // Add file upload functionality
                document.getElementById('select-file-btn')?.addEventListener('click', () => {
                    document.getElementById('excel-file')?.click();
                });

                document.getElementById('excel-file')?.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // Here you would typically process the Excel file
                        alert(`File ${file.name} telah dipilih. Fitur upload Excel akan diimplementasikan.`);
                    }
                });
                break;
        }
    }

    function showSubjectsForMajor(major) {
        const container = document.getElementById('subjects-container');
        const grid = document.getElementById('subjects-grid');
        
        if (!container || !grid) return;

        const ipaSubjects = ['Matematika', 'Kimia', 'Fisika', 'Biologi', 'Bahasa Indonesia', 'Bahasa Inggris', 'Informatika', 'Kewirausahaan', 'Muatan Lokal', 'Penjaskes'];
        const ipsSubjects = ['Ekonomi', 'Sosiologi', 'Geografi', 'Antropologi', 'Bahasa Indonesia', 'Bahasa Inggris', 'Kewirausahaan', 'Muatan Lokal', 'Penjaskes'];

        const subjects = major === 'ipa' ? ipaSubjects : major === 'ips' ? ipsSubjects : [];

        if (subjects.length > 0) {
            container.classList.remove('hidden');
            grid.innerHTML = subjects.map(subject => `
                <div>
                    <label class="block text-xs font-medium text-slate-700 mb-1">${subject}</label>
                    <input type="number" name="subject_${subject.toLowerCase().replace(/\s+/g, '_')}" min="0" max="100" class="w-full border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="0-100">
                </div>
            `).join('');
        } else {
            container.classList.add('hidden');
        }
    }

    function handleAddStudent(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const studentData = {
            id: Date.now(),
            name: formData.get('fullName'),
            class: formData.get('class'),
            major: formData.get('major'),
            subjects: {},
            grade: 0
        };

        // Calculate average grade from subjects
        const subjectInputs = e.target.querySelectorAll('input[name^="subject_"]');
        let totalGrade = 0;
        let subjectCount = 0;

        subjectInputs.forEach(input => {
            if (input.value) {
                const subjectName = input.name.replace('subject_', '').replace(/_/g, ' ');
                studentData.subjects[subjectName] = parseInt(input.value);
                totalGrade += parseInt(input.value);
                subjectCount++;
            }
        });

        if (subjectCount > 0) {
            studentData.grade = Math.round(totalGrade / subjectCount);
        }

        // Add to students array
        appState.students.push(studentData);
        
        // Show success message
        alert(`Siswa ${studentData.name} berhasil ditambahkan!`);
        
        // Reset form
        e.target.reset();
        document.getElementById('subjects-container').classList.add('hidden');
    }

    function renderMaterials(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Materi Pelajaran</h1>
                    <button id="add-material-btn" class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                        + Tambah Materi
                    </button>
                </div>

                <!-- Material Categories -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    ${Object.entries(appState.materials).map(([category, materials]) => `
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-xl font-bold capitalize">
                                    ${category === 'umum' ? '📚 Mata Pelajaran Umum' : 
                                      category === 'mipa' ? '🔬 MIPA' : 
                                      '🌍 Sosial'}
                                </h3>
                                <span class="bg-secolab-light text-secolab px-2 py-1 rounded-full text-xs font-bold">
                                    ${materials.length} materi
                                </span>
                            </div>
                            
                            <div class="space-y-3 max-h-96 overflow-y-auto">
                                ${materials.map(material => `
                                    <div class="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer material-item" data-id="${material.id}">
                                        <div class="flex items-start justify-between">
                                            <div class="flex items-start space-x-3 flex-1">
                                                <span class="text-2xl">
                                                    ${material.type === 'pdf' ? '📄' : 
                                                      material.type === 'video' ? '🎬' : 
                                                      material.type === 'pptx' ? '📊' : '📝'}
                                                </span>
                                                <div class="flex-1">
                                                    <h4 class="font-medium text-sm text-secolab">${material.title}</h4>
                                                    <p class="text-xs text-slate-500">${material.subject}</p>
                                                    <div class="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                                                        <span>📅 ${material.uploadDate}</span>
                                                        <span>⬇️ ${material.downloads}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex flex-col space-y-1">
                                                <button class="text-xs text-blue-600 hover:underline">Lihat</button>
                                                <button class="text-xs text-green-600 hover:underline">Download</button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Recent Materials -->
                <div class="bg-white p-6 rounded-xl shadow-sm border mt-6">
                    <h3 class="text-xl font-bold mb-4">Materi Terbaru</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${Object.values(appState.materials).flat()
                            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
                            .slice(0, 6)
                            .map(material => `
                                <div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <span class="text-xl">
                                        ${material.type === 'pdf' ? '📄' : 
                                          material.type === 'video' ? '🎬' : 
                                          material.type === 'pptx' ? '📊' : '📝'}
                                    </span>
                                    <div class="flex-1">
                                        <p class="font-medium text-sm">${material.title}</p>
                                        <p class="text-xs text-slate-500">${material.subject}</p>
                                    </div>
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('add-material-btn')?.addEventListener('click', openMaterialModal);
        
        // Add material item click handlers
        container.addEventListener('click', (e) => {
            const materialItem = e.target.closest('.material-item');
            if (materialItem && !e.target.closest('button')) {
                const materialId = parseInt(materialItem.dataset.id);
                openMaterialPreview(materialId);
            }
        });
    }

    function renderQuizzes(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Kuis & Ujian</h1>
                    <button id="create-quiz-btn" class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                        + Buat Kuis Baru
                    </button>
                </div>

                <!-- Quiz Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-slate-500">Total Kuis</h3>
                                <p class="text-2xl font-bold text-secolab">${appState.quizzes.length}</p>
                            </div>
                            <div class="text-3xl">📝</div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-slate-500">Aktif</h3>
                                <p class="text-2xl font-bold text-green-600">${appState.quizzes.filter(q => q.status === 'active').length}</p>
                            </div>
                            <div class="text-3xl">✅</div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-slate-500">Selesai</h3>
                                <p class="text-2xl font-bold text-blue-600">${appState.quizzes.filter(q => q.status === 'completed').length}</p>
                            </div>
                            <div class="text-3xl">🏆</div>
                        </div>
                    </div>
                </div>

                <!-- Quiz List -->
                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">Daftar Kuis & Ujian</h3>
                        <div class="flex space-x-2">
                            <select id="quiz-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="scheduled">Terjadwal</option>
                                <option value="completed">Selesai</option>
                            </select>
                            <select id="type-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="all">Semua Tipe</option>
                                <option value="individual">Individual</option>
                                <option value="group">Kelompok</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th class="p-3 text-left">Judul Kuis</th>
                                    <th class="p-3 text-left">Mata Pelajaran</th>
                                    <th class="p-3 text-left">Tipe</th>
                                    <th class="p-3 text-left">Tenggat</th>
                                    <th class="p-3 text-left">Respons</th>
                                    <th class="p-3 text-left">Status</th>
                                    <th class="p-3 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="quiz-table-body">
                                ${appState.quizzes.map(quiz => `
                                    <tr class="border-b quiz-row hover:bg-slate-50" data-status="${quiz.status}" data-type="${quiz.type}">
                                        <td class="p-3 font-medium">${quiz.title}</td>
                                        <td class="p-3">${quiz.subject}</td>
                                        <td class="p-3">
                                            <span class="px-2 py-1 text-xs font-medium rounded-full ${quiz.type === 'individual' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                                                ${quiz.type === 'individual' ? 'Individual' : 'Kelompok'}
                                            </span>
                                        </td>
                                        <td class="p-3">${quiz.dueDate}</td>
                                        <td class="p-3">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-16 bg-slate-200 rounded-full h-2">
                                                    <div class="bg-green-500 h-2 rounded-full" style="width: ${(quiz.responses/quiz.total)*100}%"></div>
                                                </div>
                                                <span class="text-xs font-medium">${quiz.responses}/${quiz.total}</span>
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            <span class="px-2 py-1 text-xs font-medium rounded-full ${
                                                quiz.status === 'active' ? 'bg-green-100 text-green-700' :
                                                quiz.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }">
                                                ${quiz.status === 'active' ? 'Aktif' : quiz.status === 'scheduled' ? 'Terjadwal' : 'Selesai'}
                                            </span>
                                        </td>
                                        <td class="p-3">
                                            <div class="flex space-x-1">
                                                <button class="text-xs text-blue-600 hover:underline" onclick="viewQuizResults(${quiz.id})">Hasil</button>
                                                <button class="text-xs text-green-600 hover:underline" onclick="downloadQuizResults(${quiz.id})">Download</button>
                                                <button class="text-xs text-red-600 hover:underline">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for filters
        document.getElementById('quiz-filter')?.addEventListener('change', filterQuizzes);
        document.getElementById('type-filter')?.addEventListener('change', filterQuizzes);
        document.getElementById('create-quiz-btn')?.addEventListener('click', openCreateQuizModal);
    }

    function filterQuizzes() {
        const statusFilter = document.getElementById('quiz-filter')?.value || 'all';
        const typeFilter = document.getElementById('type-filter')?.value || 'all';
        const rows = document.querySelectorAll('.quiz-row');

        rows.forEach(row => {
            const matchesStatus = statusFilter === 'all' || row.dataset.status === statusFilter;
            const matchesType = typeFilter === 'all' || row.dataset.type === typeFilter;
            
            if (matchesStatus && matchesType) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    function renderGroupCreation(container) {
        container.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">Buat Kelompok</h1>
                <p class="text-slate-600 mb-6">Gunakan AI untuk membuat kelompok yang optimal atau buat manual sesuai kebutuhan</p>

                <div class="bg-white p-8 rounded-xl shadow-sm border">
                    <!-- Steps indicator -->
                    <div class="flex items-center justify-center mb-8">
                        ${appState.wizard.steps.map((step, index) => `
                            <div class="flex items-center ${index === appState.wizard.steps.length - 1 ? '' : 'flex-1'}">
                                <div class="step-indicator flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    index === appState.wizard.currentStep ? 'border-secolab bg-secolab text-white' :
                                    index < appState.wizard.currentStep ? 'border-green-500 bg-green-500 text-white' :
                                    'border-slate-300 bg-white text-slate-400'
                                }">
                                    ${index < appState.wizard.currentStep ? '✓' : index + 1}
                                </div>
                                <span class="ml-2 text-sm font-medium ${index === appState.wizard.currentStep ? 'text-secolab' : 'text-slate-500'}">${step.title}</span>
                                ${index < appState.wizard.steps.length - 1 ? '<div class="flex-1 h-0.5 bg-slate-200 ml-4"></div>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Dynamic content based on current step -->
                    <div id="wizard-content" class="min-h-96">
                        <!-- Content will be rendered by renderWizardStep function -->
                    </div>

                    <!-- Navigation buttons -->
                    <div class="flex justify-between mt-8">
                        <button id="prev-step-btn" class="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 font-medium ${appState.wizard.currentStep === 0 ? 'invisible' : ''}">
                            ← Sebelumnya
                        </button>
                        <button id="next-step-btn" class="bg-secolab text-white px-6 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                            ${appState.wizard.currentStep === appState.wizard.steps.length - 1 ? 'Selesai' : 'Selanjutnya →'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        renderWizardStep();
        setupWizardEventListeners();
    }

    function renderWizardStep() {
        const content = document.getElementById('wizard-content');
        if (!content) return;

        switch(appState.wizard.currentStep) {
            case 0: // Input Data
                content.innerHTML = `
                    <div>
                        <h3 class="text-xl font-bold mb-4">Input Data Siswa</h3>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Proyek</label>
                                <input type="text" id="project-name" value="${appState.wizard.projectName}" 
                                       class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Masukkan nama proyek">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Pilih Kelas</label>
                                <select id="class-selector" class="w-full border-slate-200 rounded-lg px-3 py-2">
                                    <option value="">Semua Kelas</option>
                                    <option value="10-A">10-A</option>
                                    <option value="10-B">10-B</option>
                                    <option value="11-A">11-A</option>
                                    <option value="11-B">11-B</option>
                                </select>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-slate-700">Pilih Siswa</label>
                                <button id="select-all-btn" class="text-sm text-secolab hover:underline">Pilih Semua</button>
                            </div>
                            
                            <div id="students-list" class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-lg border">
                                ${appState.students.map(student => `
                                    <label class="flex items-center space-x-2 p-2 rounded-md hover:bg-white cursor-pointer student-checkbox" data-class="${student.class}">
                                        <input type="checkbox" value="${student.id}" class="rounded border-slate-300 text-secolab" 
                                               ${appState.wizard.selectedStudents.has(student.id) ? 'checked' : ''}>
                                        <div class="flex-1">
                                            <p class="text-sm font-medium">${student.name}</p>
                                            <p class="text-xs text-slate-500">${student.class} • ${student.major.toUpperCase()}</p>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                            
                            <div class="text-sm text-slate-500">
                                <span id="selected-count">${appState.wizard.selectedStudents.size}</span> siswa dipilih
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 1: // AI Configuration
                content.innerHTML = `
                    <div>
                        <h3 class="text-xl font-bold mb-4">Konfigurasi AI</h3>
                        
                        <div class="space-y-6">
                            <div class="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 class="font-medium">Gunakan Rekomendasi AI</h4>
                                    <p class="text-sm text-slate-500">Biarkan AI membuat kelompok secara otomatis</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="use-ai-toggle" class="sr-only peer" ${appState.wizard.aiConfig.useAI ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div id="ai-config-options" class="${appState.wizard.aiConfig.useAI ? '' : 'hidden'}">
                                <h4 class="font-medium mb-4">Atur Prioritas AI</h4>
                                
                                <div class="space-y-4">
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-sm font-medium">Keseimbangan Nilai</label>
                                            <span id="balance-value" class="text-sm font-bold text-secolab">${appState.wizard.aiConfig.balanceGrades}%</span>
                                        </div>
                                        <input type="range" id="balance-slider" min="0" max="100" value="${appState.wizard.aiConfig.balanceGrades}" 
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <p class="text-xs text-slate-500 mt-1">Seimbangkan nilai rata-rata antar kelompok</p>
                                    </div>
                                    
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-sm font-medium">Keragaman Keahlian</label>
                                            <span id="diverse-value" class="text-sm font-bold text-secolab">${appState.wizard.aiConfig.diverseSkills}%</span>
                                        </div>
                                        <input type="range" id="diverse-slider" min="0" max="100" value="${appState.wizard.aiConfig.diverseSkills}" 
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <p class="text-xs text-slate-500 mt-1">Campurkan siswa dengan keahlian berbeda</p>
                                    </div>
                                    
                                    <div>
                                        <div class="flex justify-between items-center mb-2">
                                            <label class="text-sm font-medium">Gaya Kolaborasi</label>
                                            <span id="collab-value" class="text-sm font-bold text-secolab">${appState.wizard.aiConfig.collaborationStyle}%</span>
                                        </div>
                                        <input type="range" id="collab-slider" min="0" max="100" value="${appState.wizard.aiConfig.collaborationStyle}" 
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <p class="text-xs text-slate-500 mt-1">Pertimbangkan gaya kerja sama siswa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 2: // AI Processing
                content.innerHTML = `
                    <div class="text-center py-12">
                        <div class="w-16 h-16 border-4 border-secolab border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 class="text-xl font-bold mb-2">AI Sedang Memproses...</h3>
                        <p id="processing-status" class="text-slate-500 mb-4">Menganalisis data siswa...</p>
                        <div class="w-64 bg-slate-200 rounded-full h-2 mx-auto">
                            <div id="processing-progress" class="bg-secolab h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                        </div>
                    </div>
                `;
                startAIProcessing();
                break;

            case 3: // Results
                content.innerHTML = `
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold">Hasil Kelompok</h3>
                            <div class="text-sm text-slate-500">
                                ${appState.wizard.generatedGroups.length} kelompok dibuat • ${appState.wizard.selectedStudents.size} siswa
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            ${appState.wizard.generatedGroups.map((group, index) => `
                                <div class="p-4 border rounded-lg bg-slate-50">
                                    <h4 class="font-bold text-secolab mb-3">Kelompok ${index + 1}</h4>
                                    <div class="space-y-2">
                                        ${group.map(student => `
                                            <div class="flex items-center justify-between p-2 bg-white rounded border">
                                                <div>
                                                    <p class="text-sm font-medium">${student.name}</p>
                                                    <p class="text-xs text-slate-500">${student.class}</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="flex items-center space-x-1 mb-1">
                                                        <span class="text-lg">${getRoleIcon(student.role)}</span>
                                                        <select class="text-xs border-0 bg-transparent font-medium text-secolab role-selector" data-student-id="${student.id}" data-group-index="${index}">
                                                            ${['Leader', 'Researcher', 'Analyst', 'Designer', 'Speaker'].map(role => 
                                                                `<option value="${role}" ${student.role === role ? 'selected' : ''}>${role}</option>`
                                                            ).join('')}
                                                        </select>
                                                    </div>
                                                    <button class="text-xs text-blue-600 hover:underline role-info-btn" data-role="${student.role}">
                                                        ℹ️ Info Role
                                                    </button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div class="flex items-start space-x-3">
                                <span class="text-green-600 text-lg">✅</span>
                                <div>
                                    <h4 class="font-medium text-green-800">Kelompok Siap!</h4>
                                    <p class="text-sm text-green-700">AI telah membuat kelompok yang optimal berdasarkan kriteria yang Anda tentukan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
    }

    function setupWizardEventListeners() {
        // Navigation buttons
        document.getElementById('prev-step-btn')?.addEventListener('click', () => {
            if (appState.wizard.currentStep > 0) {
                appState.wizard.currentStep--;
                renderGroupCreation(document.getElementById('main-content'));
            }
        });

        document.getElementById('next-step-btn')?.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (appState.wizard.currentStep === appState.wizard.steps.length - 1) {
                    // Finish wizard
                    saveGroupProject();
                } else {
                    appState.wizard.currentStep++;
                    renderGroupCreation(document.getElementById('main-content'));
                }
            }
        });

        // Step-specific event listeners
        switch(appState.wizard.currentStep) {
            case 0:
                setupStep0Listeners();
                break;
            case 1:
                setupStep1Listeners();
                break;
            case 3:
                setupStep3Listeners();
                break;
        }
    }

    function setupStep0Listeners() {
        // Project name input
        document.getElementById('project-name')?.addEventListener('input', (e) => {
            appState.wizard.projectName = e.target.value;
        });

        // Class selector
        document.getElementById('class-selector')?.addEventListener('change', (e) => {
            appState.wizard.selectedClass = e.target.value;
            filterStudentsByClass(e.target.value);
        });

        // Select all button
        document.getElementById('select-all-btn')?.addEventListener('click', () => {
            const visibleCheckboxes = document.querySelectorAll('.student-checkbox:not(.hidden) input[type="checkbox"]');
            const allChecked = Array.from(visibleCheckboxes).every(cb => cb.checked);
            
            visibleCheckboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
                const studentId = parseInt(checkbox.value);
                if (checkbox.checked) {
                    appState.wizard.selectedStudents.add(studentId);
                } else {
                    appState.wizard.selectedStudents.delete(studentId);
                }
            });
            
            updateSelectedCount();
        });

        // Student checkboxes
        document.getElementById('students-list')?.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const studentId = parseInt(e.target.value);
                if (e.target.checked) {
                    appState.wizard.selectedStudents.add(studentId);
                } else {
                    appState.wizard.selectedStudents.delete(studentId);
                }
                updateSelectedCount();
            }
        });
    }

    function setupStep1Listeners() {
        // AI toggle
        document.getElementById('use-ai-toggle')?.addEventListener('change', (e) => {
            appState.wizard.aiConfig.useAI = e.target.checked;
            document.getElementById('ai-config-options')?.classList.toggle('hidden', !e.target.checked);
        });

        // Sliders
        const sliders = ['balance', 'diverse', 'collab'];
        sliders.forEach(slider => {
            const element = document.getElementById(`${slider}-slider`);
            const valueElement = document.getElementById(`${slider}-value`);
            
            element?.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                valueElement.textContent = `${value}%`;
                
                if (slider === 'balance') appState.wizard.aiConfig.balanceGrades = value;
                if (slider === 'diverse') appState.wizard.aiConfig.diverseSkills = value;
                if (slider === 'collab') appState.wizard.aiConfig.collaborationStyle = value;
            });
        });
    }

    function setupStep3Listeners() {
        // Role selectors
        document.querySelectorAll('.role-selector').forEach(select => {
            select.addEventListener('change', (e) => {
                const studentId = parseInt(e.target.dataset.studentId);
                const groupIndex = parseInt(e.target.dataset.groupIndex);
                const newRole = e.target.value;
                
                const student = appState.wizard.generatedGroups[groupIndex].find(s => s.id === studentId);
                if (student) {
                    student.role = newRole;
                }
                
                // Update role icon
                const roleIcon = e.target.parentElement.querySelector('.text-lg');
                if (roleIcon) {
                    roleIcon.textContent = getRoleIcon(newRole);
                }
            });
        });

        // Role info buttons
        document.querySelectorAll('.role-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.target.dataset.role;
                showRoleInfo(role);
            });
        });
    }

    function filterStudentsByClass(selectedClass) {
        const studentCheckboxes = document.querySelectorAll('.student-checkbox');
        studentCheckboxes.forEach(checkbox => {
            const studentClass = checkbox.dataset.class;
            if (!selectedClass || studentClass === selectedClass) {
                checkbox.classList.remove('hidden');
            } else {
                checkbox.classList.add('hidden');
                // Uncheck hidden students
                const input = checkbox.querySelector('input');
                if (input.checked) {
                    input.checked = false;
                    appState.wizard.selectedStudents.delete(parseInt(input.value));
                }
            }
        });
        updateSelectedCount();
    }

    function updateSelectedCount() {
        const countElement = document.getElementById('selected-count');
        if (countElement) {
            countElement.textContent = appState.wizard.selectedStudents.size;
        }
    }

    function validateCurrentStep() {
        switch(appState.wizard.currentStep) {
            case 0:
                if (appState.wizard.selectedStudents.size < 2) {
                    alert('Pilih minimal 2 siswa untuk membuat kelompok.');
                    return false;
                }
                if (!appState.wizard.projectName.trim()) {
                    alert('Masukkan nama proyek.');
                    return false;
                }
                break;
        }
        return true;
    }

    function startAIProcessing() {
        const statuses = [
            'Menganalisis data siswa...',
            'Menghitung kompatibilitas...',
            'Mengoptimalkan pembagian kelompok...',
            'Menugaskan peran...',
            'Finalisasi kelompok...'
        ];

        let currentStatus = 0;
        const interval = setInterval(() => {
            const statusElement = document.getElementById('processing-status');
            const progressElement = document.getElementById('processing-progress');
            
            if (statusElement && progressElement) {
                statusElement.textContent = statuses[currentStatus];
                progressElement.style.width = `${((currentStatus + 1) / statuses.length) * 100}%`;
            }
            
            currentStatus++;
            if (currentStatus >= statuses.length) {
                clearInterval(interval);
                // Generate groups
                generateAIGroups();
                
                // Auto-advance to next step after a short delay
                setTimeout(() => {
                    appState.wizard.currentStep++;
                    renderGroupCreation(document.getElementById('main-content'));
                }, 1000);
            }
        }, 800);
    }

    function generateAIGroups() {
        const selectedStudents = appState.students.filter(s => appState.wizard.selectedStudents.has(s.id));
        const groupSize = 4;
        const numGroups = Math.ceil(selectedStudents.length / groupSize);
        
        // Simple grouping algorithm (in a real app, this would be more sophisticated)
        const groups = Array.from({ length: numGroups }, () => []);
        const roles = ['Leader', 'Researcher', 'Analyst', 'Designer', 'Speaker'];
        
        // Sort students by grade for balanced distribution
        selectedStudents.sort((a, b) => b.grade - a.grade);
        
        // Distribute students evenly across groups
        selectedStudents.forEach((student, index) => {
            const groupIndex = index % numGroups;
            const roleIndex = groups[groupIndex].length % roles.length;
            
            groups[groupIndex].push({
                ...student,
                role: roles[roleIndex]
            });
        });
        
        appState.wizard.generatedGroups = groups;
    }

    function saveGroupProject() {
        const newProject = {
            id: Date.now(),
            name: appState.wizard.projectName,
            createdDate: new Date().toISOString().split('T')[0],
            groups: appState.wizard.generatedGroups.map(group => ({
                members: group,
                tasks: []
            })),
            status: 'active'
        };
        
        appState.projects.push(newProject);
        
        // Reset wizard
        appState.wizard.currentStep = 0;
        appState.wizard.selectedStudents.clear();
        appState.wizard.generatedGroups = [];
        appState.wizard.projectName = 'Proyek Kelompok Baru';
        
        // Navigate to projects
        navigate('proyek');
    }

    function getRoleIcon(role) {
        const icons = {
            'Leader': '👑',
            'Researcher': '🔍',
            'Analyst': '📊',
            'Designer': '🎨',
            'Speaker': '🎤'
        };
        return icons[role] || '👤';
    }

    function showRoleInfo(role) {
        const roleDescriptions = {
            'Leader': 'Memimpin tim, mengkoordinasi anggota, dan memastikan proyek berjalan sesuai jadwal.',
            'Researcher': 'Mencari dan mengumpulkan informasi yang diperlukan untuk proyek.',
            'Analyst': 'Menganalisis data dan informasi untuk menghasilkan insight yang berguna.',
            'Designer': 'Membuat visualisasi, desain, dan presentasi yang menarik.',
            'Speaker': 'Mempresentasikan hasil kerja tim dan berkomunikasi dengan pihak lain.'
        };
        
        alert(`${role}:\n${roleDescriptions[role]}`);
    }

    function renderProjects(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Proyek & Tugas</h1>
                    <button class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium" onclick="navigate('buat-kelompok')">
                        + Buat Proyek Baru
                    </button>
                </div>

                ${appState.projects.length === 0 ? `
                    <div class="bg-white p-12 rounded-xl shadow-sm border text-center">
                        <div class="text-6xl mb-4">📝</div>
                        <h3 class="text-xl font-bold text-slate-800 mb-2">Belum Ada Proyek</h3>
                        <p class="text-slate-600 mb-4">Mulai dengan membuat kelompok dan proyek pertama Anda.</p>
                        <button class="bg-secolab text-white px-6 py-3 rounded-lg hover:bg-secolab-dark font-medium" onclick="navigate('buat-kelompok')">
                            Buat Kelompok Pertama
                        </button>
                    </div>
                ` : `
                    <div class="space-y-6">
                        ${appState.projects.map((project, projectIndex) => `
                            <div class="bg-white p-6 rounded-xl shadow-sm border">
                                <div class="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-800">${project.name}</h2>
                                        <p class="text-slate-600">Dibuat: ${new Date(project.createdDate).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <button class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium add-task-btn" data-project-index="${projectIndex}">
                                        + Tambah Tugas
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${project.groups.map((group, groupIndex) => `
                                        <div class="p-4 border rounded-lg bg-slate-50">
                                            <div class="flex justify-between items-center mb-3">
                                                <h3 class="font-bold text-slate-800">Kelompok ${groupIndex + 1}</h3>
                                                <span class="text-xs bg-secolab-light text-secolab px-2 py-1 rounded-full">
                                                    ${group.members.length} anggota
                                                </span>
                                            </div>
                                            
                                            <!-- Group Members -->
                                            <div class="mb-4">
                                                <h4 class="text-sm font-medium text-slate-600 mb-2">Anggota:</h4>
                                                <div class="space-y-1">
                                                    ${group.members.map(member => `
                                                        <div class="flex items-center space-x-2 text-xs">
                                                            <span>${getRoleIcon(member.role)}</span>
                                                            <span class="font-medium">${member.name}</span>
                                                            <span class="text-slate-500">(${member.role})</span>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>

                                            <!-- Tasks -->
                                            <div class="mb-4">
                                                <h4 class="text-sm font-medium text-slate-600 mb-2">Tugas (${group.tasks.length}):</h4>
                                                <div class="space-y-2 max-h-32 overflow-y-auto">
                                                    ${group.tasks.length === 0 ? 
                                                        '<p class="text-xs text-slate-400 italic">Belum ada tugas</p>' :
                                                        group.tasks.map((task, taskIndex) => `
                                                            <div class="bg-white p-2 rounded border text-xs">
                                                                <p class="font-medium">${task.title}</p>
                                                                <div class="flex justify-between items-center mt-1">
                                                                    <span class="text-slate-500">
                                                                        Untuk: ${appState.students.find(s => s.id === task.assignedTo)?.name || 'Semua'}
                                                                    </span>
                                                                    <select class="text-xs border-slate-200 rounded px-1 task-status-select" 
                                                                            data-project="${projectIndex}" data-group="${groupIndex}" data-task="${taskIndex}">
                                                                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                                                                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>Progress</option>
                                                                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Selesai</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        `).join('')
                                                    }
                                                </div>
                                            </div>

                                            <!-- Progress Bar -->
                                            <div class="mb-2">
                                                <div class="flex justify-between items-center mb-1">
                                                    <span class="text-xs font-medium text-slate-600">Progress</span>
                                                    <span class="text-xs font-bold text-green-600">${calculateGroupProgress(group)}%</span>
                                                </div>
                                                <div class="w-full bg-slate-200 rounded-full h-2">
                                                    <div class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                                         style="width: ${calculateGroupProgress(group)}%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        // Add event listeners
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-task-btn')) {
                const projectIndex = parseInt(e.target.dataset.projectIndex);
                openAddTaskModal(projectIndex);
            }
        });

        container.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-status-select')) {
                const { project, group, task } = e.target.dataset;
                const projectIndex = parseInt(project);
                const groupIndex = parseInt(group);
                const taskIndex = parseInt(task);
                
                appState.projects[projectIndex].groups[groupIndex].tasks[taskIndex].status = e.target.value;
                
                // Update progress bar
                const progressBar = e.target.closest('.p-4').querySelector('.bg-green-500');
                const progressText = e.target.closest('.p-4').querySelector('.text-green-600');
                const newProgress = calculateGroupProgress(appState.projects[projectIndex].groups[groupIndex]);
                
                if (progressBar && progressText) {
                    progressBar.style.width = `${newProgress}%`;
                    progressText.textContent = `${newProgress}%`;
                }
            }
        });
    }

    function calculateGroupProgress(group) {
        if (group.tasks.length === 0) return 0;
        const completedTasks = group.tasks.filter(task => task.status === 'completed').length;
        return Math.round((completedTasks / group.tasks.length) * 100);
    }

    function renderForum(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-slate-800">Forum Diskusi</h1>
                    <button id="create-topic-btn" class="bg-secolab text-white px-4 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                        + Buat Topik Baru
                    </button>
                </div>

                <!-- Forum Filter -->
                <div class="bg-white p-4 rounded-xl shadow-sm border mb-6">
                    <div class="flex flex-wrap items-center gap-4">
                        <div>
                            <label class="text-sm font-medium text-slate-600 mr-2">Filter Mata Pelajaran:</label>
                            <select id="subject-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="all">Semua Mata Pelajaran</option>
                                <option value="Matematika">Matematika</option>
                                <option value="Fisika">Fisika</option>
                                <option value="Kimia">Kimia</option>
                                <option value="Biologi">Biologi</option>
                                <option value="Ekonomi">Ekonomi</option>
                                <option value="Sosiologi">Sosiologi</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-slate-600 mr-2">Urutkan:</label>
                            <select id="sort-filter" class="border-slate-200 rounded-lg px-3 py-2 text-sm">
                                <option value="latest">Terbaru</option>
                                <option value="most-replies">Paling Banyak Balasan</option>
                                <option value="oldest">Terlama</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Forum Topics -->
                <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b">
                        <h3 class="font-bold text-slate-800">Topik Diskusi</h3>
                    </div>
                    <div id="forum-topics-list">
                        ${appState.forum.topics.map(topic => `
                            <div class="p-4 border-b hover:bg-slate-50 cursor-pointer topic-item" data-topic-id="${topic.id}" data-subject="${topic.subject}">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-2 mb-1">
                                            <span class="px-2 py-1 text-xs font-medium bg-secolab-light text-secolab rounded-full">
                                                ${topic.subject}
                                            </span>
                                        </div>
                                        <h4 class="font-semibold text-slate-800 mb-1">${topic.title}</h4>
                                        <p class="text-sm text-slate-600">Oleh: <span class="font-medium">${topic.author}</span></p>
                                    </div>
                                    <div class="text-right text-sm">
                                        <div class="flex items-center space-x-4 mb-1">
                                            <div class="flex items-center space-x-1">
                                                <span>💬</span>
                                                <span class="font-bold">${topic.replies}</span>
                                            </div>
                                        </div>
                                        <p class="text-slate-400">${topic.lastActivity}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Group Interaction Section -->
                <div class="bg-white p-6 rounded-xl shadow-sm border mt-6">
                    <h3 class="font-bold text-xl mb-4">Interaksi Antar Kelompok</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Kelompok 1 → Kelompok 3</h4>
                            <p class="text-sm text-slate-600 mb-2">"Bagaimana cara kalian mengatasi masalah X dalam proyek?"</p>
                            <div class="flex items-center space-x-2 text-xs text-slate-500">
                                <span>2 jam lalu</span>
                                <span>•</span>
                                <span>3 balasan</span>
                            </div>
                        </div>
                        <div class="p-4 border rounded-lg">
                            <h4 class="font-semibold mb-2">Kelompok 2 → Semua Kelompok</h4>
                            <p class="text-sm text-slate-600 mb-2">"Ada yang mau sharing referensi untuk topik Y?"</p>
                            <div class="flex items-center space-x-2 text-xs text-slate-500">
                                <span>5 jam lalu</span>
                                <span>•</span>
                                <span>7 balasan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        container.addEventListener('click', (e) => {
            if (e.target.closest('.topic-item')) {
                const topicId = parseInt(e.target.closest('.topic-item').dataset.topicId);
                openTopicDetailModal(topicId);
            }
        });

        // Filter events
        document.getElementById('subject-filter')?.addEventListener('change', filterForumTopics);
        document.getElementById('sort-filter')?.addEventListener('change', sortForumTopics);
        document.getElementById('create-topic-btn')?.addEventListener('click', openCreateTopicModal);
    }

    function renderCalendar(container) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        container.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-6">Kalender Akademik</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Calendar -->
                    <div class="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border">
                        <div class="flex justify-between items-center mb-6">
                            <button id="prev-month" class="p-2 hover:bg-slate-100 rounded-lg">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <h2 id="calendar-title" class="text-xl font-bold">
                                ${today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button id="next-month" class="p-2 hover:bg-slate-100 rounded-lg">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-7 gap-1 mb-2">
                            ${['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => 
                                `<div class="p-2 text-center text-sm font-medium text-slate-500">${day}</div>`
                            ).join('')}
                        </div>
                        
                        <div id="calendar-grid" class="grid grid-cols-7 gap-1">
                            <!-- Calendar days will be generated by JavaScript -->
                        </div>
                    </div>
                    
                    <!-- Events Sidebar -->
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 class="font-bold text-lg mb-4">Agenda Hari Ini</h3>
                            <div class="space-y-3">
                                <div class="flex items-start space-x-3">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p class="text-sm font-medium">Kuis Matematika 10-A</p>
                                        <p class="text-xs text-slate-500">09:00 - 10:30</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-3">
                                    <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p class="text-sm font-medium">Deadline Proyek Kelompok</p>
                                        <p class="text-xs text-slate-500">23:59</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 class="font-bold text-lg mb-4">Minggu Ini</h3>
                            <div class="space-y-3">
                                <div class="flex items-start space-x-3">
                                    <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div>
                                        <p class="text-sm font-medium">Ujian Fisika</p>
                                        <p class="text-xs text-slate-500">Kamis, 23 Jan</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-3">
                                    <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                    <div>
                                        <p class="text-sm font-medium">Presentasi Kelompok</p>
                                        <p class="text-xs text-slate-500">Jumat, 24 Jan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        renderCalendarGrid(currentYear, currentMonth);
    }

    function renderCalendar(container) {
        // Calendar implementation
        container.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-6">Kalender Akademik</h1>
                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <p class="text-slate-600">Fitur kalender akan segera hadir dengan integrasi jadwal kuis, tugas, dan event penting lainnya.</p>
                </div>
            </div>
        `;
    }

    function renderHelp(container) {
        container.innerHTML = `
            <div class="fade-in">
                <h1 class="text-3xl font-bold text-slate-800 mb-6">Pusat Bantuan</h1>
                
                <!-- Feedback Section -->
                <div class="bg-white p-6 rounded-xl shadow-sm border mb-6">
                    <h3 class="text-xl font-bold mb-4">Berikan Feedback</h3>
                    <div class="max-w-2xl">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 mb-2">Rating Pengalaman Anda</label>
                            <div class="flex space-x-2" id="rating-stars">
                                ${[1,2,3,4,5].map(star => `
                                    <button class="star-btn text-3xl text-slate-300 hover:text-yellow-400 transition-colors" data-rating="${star}">
                                        ⭐
                                    </button>
                                `).join('')}
                            </div>
                            <p class="text-sm text-slate-500 mt-1" id="rating-text">Pilih rating</p>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 mb-2">Ulasan dan Saran</label>
                            <textarea id="feedback-text" rows="4" class="w-full border-slate-200 rounded-lg px-3 py-2" 
                                      placeholder="Ceritakan pengalaman Anda menggunakan SecoLab..."></textarea>
                        </div>
                        
                        <button id="submit-feedback" class="bg-secolab text-white px-6 py-2 rounded-lg hover:bg-secolab-dark font-medium">
                            Kirim Feedback
                        </button>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 class="text-xl font-bold mb-6">Pertanyaan yang Sering Diajukan (FAQ)</h3>
                    <div class="space-y-4">
                        ${appState.faqs.map((faq, index) => `
                            <div class="border rounded-lg overflow-hidden">
                                <button class="faq-toggle w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center" data-index="${index}">
                                    <span class="font-medium">${faq.q}</span>
                                    <svg class="w-5 h-5 transform transition-transform faq-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                                <div class="faq-answer hidden p-4 border-t bg-white">
                                    <p class="text-slate-700">${faq.a}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="bg-white p-6 rounded-xl shadow-sm border mt-6">
                    <h3 class="text-xl font-bold mb-4">Butuh Bantuan Lebih Lanjut?</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="text-center p-4">
                            <div class="text-4xl mb-2">📧</div>
                            <h4 class="font-semibold mb-1">Email Support</h4>
                            <p class="text-sm text-slate-600">support@secolab.edu</p>
                        </div>
                        <div class="text-center p-4">
                            <div class="text-4xl mb-2">💬</div>
                            <h4 class="font-semibold mb-1">Live Chat</h4>
                            <button class="text-sm text-secolab hover:underline">Mulai Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        setupFeedbackListeners(container);
        setupFAQListeners(container);
    }

    function setupFeedbackListeners(container) {
        let selectedRating = 0;

        // Rating stars
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('star-btn')) {
                selectedRating = parseInt(e.target.dataset.rating);
                const stars = container.querySelectorAll('.star-btn');
                const ratingText = container.getElementById('rating-text');
                
                stars.forEach((star, index) => {
                    if (index < selectedRating) {
                        star.classList.add('text-yellow-400');
                        star.classList.remove('text-slate-300');
                    } else {
                        star.classList.add('text-slate-300');
                        star.classList.remove('text-yellow-400');
                    }
                });
                
                const ratingTexts = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
                ratingText.textContent = ratingTexts[selectedRating];
            }
        });

        // Submit feedback
        container.getElementById('submit-feedback')?.addEventListener('click', () => {
            const feedbackText = container.getElementById('feedback-text').value;
            
            if (selectedRating === 0) {
                alert('Mohon berikan rating terlebih dahulu.');
                return;
            }
            
            if (!feedbackText.trim()) {
                alert('Mohon tuliskan ulasan Anda.');
                return;
            }
            
            // Save feedback
            appState.feedback.push({
                rating: selectedRating,
                text: feedbackText,
                date: new Date().toISOString(),
                user: appState.user.name
            });
            
            alert('Terima kasih atas feedback Anda! Masukan Anda sangat berharga untuk pengembangan SecoLab.');
            
            // Reset form
            selectedRating = 0;
            container.getElementById('feedback-text').value = '';
            container.getElementById('rating-text').textContent = 'Pilih rating';
            container.querySelectorAll('.star-btn').forEach(star => {
                star.classList.add('text-slate-300');
                star.classList.remove('text-yellow-400');
            });
        });
    }

    function setupFAQListeners(container) {
        container.addEventListener('click', (e) => {
            if (e.target.closest('.faq-toggle')) {
                const button = e.target.closest('.faq-toggle');
                const answer = button.nextElementSibling;
                const arrow = button.querySelector('.faq-arrow');
                
                const isOpen = !answer.classList.contains('hidden');
                
                // Close all other FAQ items
                container.querySelectorAll('.faq-answer').forEach(item => {
                    item.classList.add('hidden');
                });
                container.querySelectorAll('.faq-arrow').forEach(item => {
                    item.classList.remove('rotate-180');
                });
                
                // Toggle current item
                if (!isOpen) {
                    answer.classList.remove('hidden');
                    arrow.classList.add('rotate-180');
                }
            }
        });
    }

    // AI Assistant Functions
    function toggleAIChat() {
        const aiChat = document.getElementById('ai-chat');
        if (aiChat) {
            appState.aiAssistant.isOpen = !appState.aiAssistant.isOpen;
            aiChat.classList.toggle('hidden');
            
            if (appState.aiAssistant.isOpen) {
                document.getElementById('ai-input')?.focus();
            }
        }
    }

    function closeAIChat() {
        const aiChat = document.getElementById('ai-chat');
        if (aiChat) {
            appState.aiAssistant.isOpen = false;
            aiChat.classList.add('hidden');
        }
    }

    function sendAIMessage() {
        const input = document.getElementById('ai-input');
        const messagesContainer = document.getElementById('ai-messages');
        
        if (!input || !messagesContainer) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        addAIMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        showAITyping();
        
        // Simulate AI response
        setTimeout(() => {
            hideAITyping();
            const responses = [
                "Saya dapat membantu Anda dengan membuat soal kuis, menganalisis performa siswa, atau memberikan saran untuk pembagian kelompok yang optimal.",
                "Untuk membuat kelompok yang efektif, saya sarankan mempertimbangkan keseimbangan kemampuan akademik dan gaya belajar siswa.",
                "Saya dapat membantu menganalisis data nilai siswa untuk memberikan insight tentang area yang perlu diperbaiki.",
                "Apakah Anda ingin saya membantu membuat materi pembelajaran atau soal latihan untuk mata pelajaran tertentu?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addAIMessage('bot', randomResponse);
        }, 1500);
    }

    function addAIMessage(type, text) {
        const messagesContainer = document.getElementById('ai-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 
            'bg-secolab text-white p-3 rounded-lg ml-8 text-sm' : 
            'bg-slate-100 p-3 rounded-lg mr-8 text-sm';
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to state
        appState.aiAssistant.messages.push({
            type,
            text,
            timestamp: new Date()
        });
    }

    function showAITyping() {
        const messagesContainer = document.getElementById('ai-messages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing';
        typingDiv.className = 'bg-slate-100 p-3 rounded-lg mr-8';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideAITyping() {
        const typingDiv = document.getElementById('ai-typing');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    // Modal Functions
    function openEditProfileModal() {
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-lg p-6 rounded-xl shadow-2xl">
                    <h3 class="text-xl font-bold mb-4">Edit Profil</h3>
                    <form id="edit-profile-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                            <input type="text" name="name" value="${appState.user.name}" class="w-full border-slate-200 rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input type="email" name="email" value="${appState.user.email}" class="w-full border-slate-200 rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
                            <input type="text" name="subject" value="${appState.user.class}" class="w-full border-slate-200 rounded-lg px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran Kesukaan</label>
                            <input type="text" name="favorites" value="${appState.user.favoriteSubjects.join(', ')}" class="w-full border-slate-200 rounded-lg px-3 py-2">
                        </div>
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Batal
                            </button>
                            <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            appState.user.name = formData.get('name');
            appState.user.email = formData.get('email');
            appState.user.class = formData.get('subject');
            appState.user.favoriteSubjects = formData.get('favorites').split(',').map(s => s.trim());
            
            closeModal();
            renderCurrentView();
            alert('Profil berhasil diperbarui!');
        });
    }

    function openMaterialModal() {
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-lg p-6 rounded-xl shadow-2xl">
                    <h3 class="text-xl font-bold mb-4">Tambah Materi Baru</h3>
                    <form id="add-material-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Judul Materi</label>
                            <input type="text" name="title" required class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Contoh: Bab 3 - Integral.pdf">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
                            <input type="text" name="subject" required class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Contoh: Matematika">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                            <select name="category" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Kategori</option>
                                <option value="umum">Mata Pelajaran Umum</option>
                                <option value="mipa">MIPA</option>
                                <option value="sosial">Sosial</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Tipe File</label>
                            <select name="type" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Tipe</option>
                                <option value="pdf">PDF</option>
                                <option value="pptx">PowerPoint</option>
                                <option value="docx">Word</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
                            <input type="file" name="file" class="w-full text-sm">
                        </div>
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Batal
                            </button>
                            <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium">
                                Upload Materi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('add-material-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const newMaterial = {
                id: Date.now(),
                title: formData.get('title'),
                subject: formData.get('subject'),
                type: formData.get('type'),
                uploadDate: new Date().toISOString().split('T')[0],
                downloads: 0
            };
            
            const category = formData.get('category');
            if (!appState.materials[category]) {
                appState.materials[category] = [];
            }
            appState.materials[category].push(newMaterial);
            
            closeModal();
            renderCurrentView();
            alert('Materi berhasil ditambahkan!');
        });
    }

    function openMaterialPreview(materialId) {
        const material = Object.values(appState.materials).flat().find(m => m.id === materialId);
        if (!material) return;
        
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-4xl p-6 rounded-xl shadow-2xl">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold">${material.title}</h3>
                            <p class="text-slate-600">${material.subject}</p>
                        </div>
                        <button class="close-modal text-slate-400 hover:text-slate-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="bg-slate-100 p-8 rounded-lg text-center mb-4">
                        <div class="text-6xl mb-4">
                            ${material.type === 'pdf' ? '📄' : 
                              material.type === 'video' ? '🎬' : 
                              material.type === 'pptx' ? '📊' : '📝'}
                        </div>
                        <p class="text-slate-600 mb-4">Preview materi tidak tersedia</p>
                        <p class="text-sm text-slate-500">File: ${material.title}</p>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-slate-500">
                            Diupload: ${material.uploadDate} • ${material.downloads} unduhan
                        </div>
                        <div class="space-x-2">
                            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
                                Download
                            </button>
                            <button class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
    }

    function openCreateQuizModal() {
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-2xl p-6 rounded-xl shadow-2xl max-h-screen overflow-y-auto">
                    <h3 class="text-xl font-bold mb-4">Buat Kuis Baru</h3>
                    <form id="create-quiz-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Judul Kuis</label>
                                <input type="text" name="title" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
                                <select name="subject" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                    <option value="">Pilih Mata Pelajaran</option>
                                    <option value="Matematika">Matematika</option>
                                    <option value="Fisika">Fisika</option>
                                    <option value="Kimia">Kimia</option>
                                    <option value="Biologi">Biologi</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Kuis</label>
                                <select name="quizType" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                    <option value="">Pilih Jenis</option>
                                    <option value="multiple-choice">Pilihan Ganda</option>
                                    <option value="essay">Essay</option>
                                    <option value="project">Project Based Learning</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Tipe Tugas</label>
                                <select name="type" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                    <option value="">Pilih Tipe</option>
                                    <option value="individual">Individual</option>
                                    <option value="group">Kelompok</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Tenggat</label>
                                <input type="date" name="dueDate" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Waktu Tenggat</label>
                                <input type="time" name="dueTime" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Sistem Penilaian</label>
                            <select name="gradingSystem" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Sistem</option>
                                <option value="percentage">Persentase (0-100)</option>
                                <option value="points">Poin</option>
                                <option value="letter">Huruf (A, B, C, D)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Deskripsi/Instruksi</label>
                            <textarea name="description" rows="4" class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Berikan instruksi detail untuk kuis ini..."></textarea>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" name="attachments" id="allow-attachments" class="rounded border-slate-300 text-secolab">
                            <label for="allow-attachments" class="text-sm font-medium text-slate-700">Izinkan lampiran file dari siswa</label>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Batal
                            </button>
                            <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium">
                                Buat Kuis
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateInput = document.querySelector('input[name="dueDate"]');
        if (dateInput) {
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Add event listeners
        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('create-quiz-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const newQuiz = {
                id: Date.now(),
                title: formData.get('title'),
                subject: formData.get('subject'),
                type: formData.get('type'),
                dueDate: formData.get('dueDate'),
                status: 'scheduled',
                responses: 0,
                total: appState.students.length
            };
            
            appState.quizzes.push(newQuiz);
            
            closeModal();
            renderCurrentView();
            alert('Kuis berhasil dibuat!');
        });
    }

    function openAddTaskModal(projectIndex) {
        const project = appState.projects[projectIndex];
        const allMembers = project.groups.flatMap(group => group.members);
        
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-lg p-6 rounded-xl shadow-2xl">
                    <h3 class="text-xl font-bold mb-4">Tambah Tugas - ${project.name}</h3>
                    <form id="add-task-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nama Tugas</label>
                            <input type="text" name="title" required class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Contoh: Analisis Data Statistik">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Tugas</label>
                            <select name="taskType" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Jenis</option>
                                <option value="research">Research</option>
                                <option value="analysis">Analisis</option>
                                <option value="presentation">Presentasi</option>
                                <option value="writing">Penulisan</option>
                                <option value="design">Desain</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
                            <select name="subject" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Mata Pelajaran</option>
                                <option value="Matematika">Matematika</option>
                                <option value="Fisika">Fisika</option>
                                <option value="Kimia">Kimia</option>
                                <option value="Biologi">Biologi</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Tugaskan ke</label>
                            <select name="assignTo" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Penerima Tugas</option>
                                <option value="all">Semua Anggota</option>
                                ${project.groups.map((group, groupIndex) => 
                                    `<optgroup label="Kelompok ${groupIndex + 1}">
                                        ${group.members.map(member => 
                                            `<option value="${member.id}">${member.name} (${member.role})</option>`
                                        ).join('')}
                                    </optgroup>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Tenggat Waktu</label>
                            <input type="datetime-local" name="deadline" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Deskripsi Tugas</label>
                            <textarea name="description" rows="3" class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Jelaskan detail tugas yang harus dikerjakan..."></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Upload Dokumen Pendukung</label>
                            <input type="file" name="attachments" multiple class="w-full text-sm" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png">
                        </div>
                        
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" name="allowCollaboration" id="allow-collab" class="rounded border-slate-300 text-secolab">
                                <label for="allow-collab" class="text-sm font-medium text-slate-700">Anggota boleh saling membantu antar role</label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" name="enableNotifications" id="enable-notif" class="rounded border-slate-300 text-secolab" checked>
                                <label for="enable-notif" class="text-sm font-medium text-slate-700">Kirim notifikasi jika ada anggota yang belum mengerjakan</label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Batal
                            </button>
                            <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium">
                                Tambah Tugas
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Set default deadline to 1 week from now
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const deadlineInput = document.querySelector('input[name="deadline"]');
        if (deadlineInput) {
            deadlineInput.value = nextWeek.toISOString().slice(0, 16);
        }
        
        // Add event listeners
        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('add-task-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const assignTo = formData.get('assignTo');
            const newTask = {
                id: Date.now(),
                title: formData.get('title'),
                description: formData.get('description'),
                taskType: formData.get('taskType'),
                subject: formData.get('subject'),
                deadline: formData.get('deadline'),
                assignedTo: assignTo === 'all' ? 'all' : parseInt(assignTo),
                status: 'pending',
                allowCollaboration: formData.get('allowCollaboration') === 'on',
                enableNotifications: formData.get('enableNotifications') === 'on',
                createdDate: new Date().toISOString()
            };
            
            // Add task to appropriate groups
            if (assignTo === 'all') {
                project.groups.forEach(group => {
                    group.tasks.push({...newTask});
                });
            } else {
                const targetGroupIndex = project.groups.findIndex(group => 
                    group.members.some(member => member.id === parseInt(assignTo))
                );
                if (targetGroupIndex !== -1) {
                    project.groups[targetGroupIndex].tasks.push(newTask);
                }
            }
            
            closeModal();
            renderCurrentView();
            alert('Tugas berhasil ditambahkan!');
        });
    }

    function openTopicDetailModal(topicId) {
        const topic = appState.forum.topics.find(t => t.id === topicId);
        if (!topic) return;
        
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-3xl p-6 rounded-xl shadow-2xl max-h-screen overflow-y-auto">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="px-2 py-1 text-xs font-medium bg-secolab-light text-secolab rounded-full">
                                    ${topic.subject}
                                </span>
                            </div>
                            <h3 class="text-xl font-bold">${topic.title}</h3>
                            <p class="text-sm text-slate-600">Oleh: ${topic.author} • ${topic.lastActivity}</p>
                        </div>
                        <button class="close-modal text-slate-400 hover:text-slate-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Discussion Thread -->
                    <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        <div class="p-4 bg-slate-50 rounded-lg">
                            <div class="flex items-center space-x-2 mb-2">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" 
                                     alt="Avatar" class="w-8 h-8 rounded-full">
                                <span class="font-semibold text-sm">${topic.author}</span>
                                <span class="text-xs text-slate-500">2 hari lalu</span>
                            </div>
                            <p class="text-sm">Selamat pagi semuanya, saya ingin bertanya mengenai penyelesaian soal integral pada bab terakhir. Apakah ada yang bisa membantu menjelaskan langkah-langkahnya?</p>
                            <div class="flex items-center space-x-4 mt-3 text-xs">
                                <button class="flex items-center space-x-1 text-slate-500 hover:text-secolab">
                                    <span>👍</span><span>5</span>
                                </button>
                                <button class="flex items-center space-x-1 text-slate-500 hover:text-secolab">
                                    <span>💬</span><span>Balas</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Sample replies -->
                        <div class="pl-6">
                            <div class="p-3 bg-white rounded-lg border">
                                <div class="flex items-center space-x-2 mb-2">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                         alt="Avatar" class="w-6 h-6 rounded-full">
                                    <span class="font-semibold text-sm">Pak Guru</span>
                                    <span class="text-xs text-slate-500">1 hari lalu</span>
                                </div>
                                <p class="text-sm">Untuk integral tersebut, coba gunakan metode substitusi dulu. Lihat apakah ada bagian yang bisa disubstitusi untuk mempermudah perhitungan.</p>
                            </div>
                        </div>
                        
                        <div class="pl-6">
                            <div class="p-3 bg-white rounded-lg border">
                                <div class="flex items-center space-x-2 mb-2">
                                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" 
                                         alt="Avatar" class="w-6 h-6 rounded-full">
                                    <span class="font-semibold text-sm">Siti Nurhaliza</span>
                                    <span class="text-xs text-slate-500">1 hari lalu</span>
                                </div>
                                <p class="text-sm">Saya juga awalnya bingung, tapi setelah mencoba beberapa kali akhirnya paham. Mau saya buatkan video penjelasannya?</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reply Form -->
                    <div class="border-t pt-4">
                        <h4 class="font-semibold mb-3">Tulis Balasan</h4>
                        <form id="reply-form">
                            <textarea rows="3" class="w-full border-slate-200 rounded-lg px-3 py-2 mb-3" placeholder="Tulis balasan Anda..."></textarea>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-2">
                                    <button type="button" class="text-sm text-slate-500 hover:text-secolab">📎 Lampiran</button>
                                    <button type="button" class="text-sm text-slate-500 hover:text-secolab">😊 Emoji</button>
                                </div>
                                <div class="space-x-2">
                                    <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm">
                                        Tutup
                                    </button>
                                    <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium text-sm">
                                        Kirim Balasan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('reply-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Balasan berhasil dikirim!');
            closeModal();
        });
    }

    function openCreateTopicModal() {
        const modalHTML = `
            <div class="modal-backdrop">
                <div class="modal-content w-full max-w-lg p-6 rounded-xl shadow-2xl">
                    <h3 class="text-xl font-bold mb-4">Buat Topik Diskusi Baru</h3>
                    <form id="create-topic-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
                            <select name="subject" required class="w-full border-slate-200 rounded-lg px-3 py-2">
                                <option value="">Pilih Mata Pelajaran</option>
                                <option value="Matematika">Matematika</option>
                                <option value="Fisika">Fisika</option>
                                <option value="Kimia">Kimia</option>
                                <option value="Biologi">Biologi</option>
                                <option value="Ekonomi">Ekonomi</option>
                                <option value="Sosiologi">Sosiologi</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Judul Topik</label>
                            <input type="text" name="title" required class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Contoh: Diskusi Soal Ujian Tengah Semester">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Deskripsi/Pertanyaan</label>
                            <textarea name="description" rows="4" required class="w-full border-slate-200 rounded-lg px-3 py-2" placeholder="Jelaskan topik diskusi atau pertanyaan Anda..."></textarea>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" name="allowAttachments" id="allow-attach" class="rounded border-slate-300 text-secolab">
                            <label for="allow-attach" class="text-sm font-medium text-slate-700">Izinkan lampiran dalam diskusi</label>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" class="close-modal bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium">
                                Batal
                            </button>
                            <button type="submit" class="bg-secolab text-white px-4 py-2 rounded-lg font-medium">
                                Buat Topik
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) closeModal();
        });
        
        document.getElementById('create-topic-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const newTopic = {
                id: Date.now(),
                title: formData.get('title'),
                subject: formData.get('subject'),
                author: appState.user.name,
                replies: 0,
                lastActivity: 'Baru saja'
            };
            
            appState.forum.topics.unshift(newTopic);
            
            closeModal();
            renderCurrentView();
            alert('Topik diskusi berhasil dibuat!');
        });
    }

    function closeModal() {
        const modal = document.querySelector('.modal-backdrop');
        if (modal) {
            modal.remove();
        }
    }

    // Filter and sort functions
    function filterForumTopics() {
        const subjectFilter = document.getElementById('subject-filter')?.value || 'all';
        const topics = document.querySelectorAll('.topic-item');
        
        topics.forEach(topic => {
            const topicSubject = topic.dataset.subject;
            if (subjectFilter === 'all' || topicSubject === subjectFilter) {
                topic.classList.remove('hidden');
            } else {
                topic.classList.add('hidden');
            }
        });
    }

    function sortForumTopics() {
        // Implementation for sorting forum topics
        console.log('Sorting forum topics...');
    }

    // Chart functions
    function renderProjectChart() {
        const ctx = document.getElementById('projectChart')?.getContext('2d');
        if (!ctx) return;
        
        const data = appState.dashboard.stats.runningProjects;
        appState.chartInstances.project = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Sudah Dikerjakan'],
                datasets: [{
                    data: [data.notStarted, data.inProgress, data.completed],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function renderTaskChart() {
        const ctx = document.getElementById('taskChart')?.getContext('2d');
        if (!ctx) return;
        
        const data = appState.dashboard.stats.completedTasks;
        appState.chartInstances.task = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Sudah Dikerjakan'],
                datasets: [{
                    data: [data.notStarted, data.inProgress, data.completed],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function destroyCharts() {
        Object.values(appState.chartInstances).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        appState.chartInstances = {};
    }

    // Utility functions
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }

    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }

    // Global functions for onclick handlers
    window.navigate = navigate;
    window.viewQuizResults = function(quizId) {
        alert(`Menampilkan hasil kuis ID: ${quizId}`);
    };
    window.downloadQuizResults = function(quizId) {
        alert(`Mengunduh hasil kuis ID: ${quizId}`);
    };

    // Initialize the application
    init();
});