        // Цвета для первых трех курсов
        const presetCourseColors = [
            {
                background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                border: '#28a745',
                icon: '🐍'
            },
            {
                background: 'linear-gradient(135deg, #dfee0dff 0%, #cddb07ff 100%)',
                border: '#dfee0dff',
                icon: '⚡'
            },
            {
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                border: '#dc3545',
                icon: '🚀'
            }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            // Загрузка курсов из localStorage
            loadCourses();

            // Обработчики для открытия модального окна
            document.getElementById('open-modal-btn').addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });

            document.getElementById('hero-add-btn').addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });

            document.getElementById('footer-add-btn').addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });

            // Обработчик для закрытия модального окна
            document.getElementById('close-modal-btn').addEventListener('click', function() {
                closeModal();
            });

            // Закрытие модального окна при клике вне его
            document.getElementById('course-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });

            // Закрытие модального окна по клавише ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            // Обработка формы добавления курса
            document.getElementById('course-form').addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('course-name').value;
                const description = document.getElementById('course-description').value;
                const category = document.getElementById('course-category').value;
                const duration = document.getElementById('course-duration').value;
                const level = document.getElementById('course-level').value;

                addCourse(name, description, category, duration, level);
                closeModal();
                this.reset();
            });

            // Обработчик кнопки удаления всех курсов
            document.getElementById('delete-all-btn').addEventListener('click', function() {
                deleteAllCourses();
            });
        });

        // Функции для работы с модальным окном
        function openModal() {
            document.getElementById('course-modal').style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
        }

        function closeModal() {
            document.getElementById('course-modal').style.display = 'none';
            document.body.style.overflow = 'auto'; // Восстанавливаем прокрутку
            document.getElementById('course-form').reset(); // Сбрасываем форму
        }

        // Функция удаления всех курсов
        function deleteAllCourses() {
            const courses = JSON.parse(localStorage.getItem('eduCourses')) || [];
            if (courses.length === 0) {
                showNotification('Нет курсов для удаления!', 'info');
                return;
            }
            
            const isConfirmed = confirm('⚠️ Вы уверены, что хотите удалить ВСЕ курсы? Это действие нельзя отменить!');
            
            if (isConfirmed) {
                localStorage.removeItem('eduCourses');
                loadCourses();
                showNotification('Все курсы успешно удалены!', 'success');
            }
        }

        function loadCourses() {
            const coursesContainer = document.getElementById('courses-container');
            const courses = JSON.parse(localStorage.getItem('eduCourses')) || [];
            
            if (courses.length < 3) {
                const sampleCourses = [
                    {
                        id: 1,
                        name: "Python основы",
                        description: "Помогает освоить базовые понятия Python, включая типы данных, конструкции языка и принципы чёткой структуры программы.",
                        category: "python",
                        duration: "56",
                        level: "beginner",
                        students: 13412,
                        rating: 4.8,
                        progress: 0,
                        date: "2025-09-01"
                    },{
                        id: 2,
                        name: "Java Script",
                        description: "программирования JavaScript. В ходе курса вы узнаете основные концепции языка, включая переменные, типы данных, условные конструкции, циклы, функции и объекты",
                        category: "javaScript",
                        duration: "48",
                        level: "beginner",
                        students: 7633,
                        rating: 4.4,
                        progress: 0,
                        date: "2025-09-01"
                    },{
                        id: 3,
                        name: "Flask",
                        description: "Освойте создание современных веб-приложений с помощью Flask — одного из самых популярных Python-фреймворков",
                        category: "flask",
                        duration: "21",
                        level: "beginner",
                        students: 4651,
                        rating: 4.9,
                        progress: 0,
                        date: "2025-09-01"
                    }
                ];
                
                localStorage.setItem('eduCourses', JSON.stringify(sampleCourses));
                courses.push(...sampleCourses);
            }
            
            coursesContainer.innerHTML = '';
            
            courses.forEach((course, index) => {
                const courseCard = createCourseCard(course, index);
                coursesContainer.appendChild(courseCard);
            });
        }

        function createCourseCard(course, index) {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            let courseStyle = {};
            let courseIcon = getCategoryIcon(course.category);
            
            if (index < 3 && presetCourseColors[index]) {
                courseStyle = presetCourseColors[index];
                courseIcon = courseStyle.icon;
            } else {
                const colorHash = stringToColor(course.category);
                const darkerColor = adjustColor(colorHash, -40);
                courseStyle = {
                    background: `linear-gradient(135deg, ${colorHash} 0%, ${darkerColor} 100%)`,
                    border: colorHash,
                    icon: courseIcon
                };
            }
            
            const levelText = getLevelText(course.level);
            const categoryName = getCategoryName(course.category);
            
            courseCard.innerHTML = `
                <div class="course-badge">${levelText}</div>
                <div class="course-image" style="background: ${courseStyle.background}; border-bottom: 2px solid ${courseStyle.border}">
                    <div style="font-size: 60px; color: white;">${courseStyle.icon}</div>
                </div>
                <div class="course-info">
                    <h3 class="course-title">${escapeHtml(course.name)}</h3>
                    <p class="course-description">${escapeHtml(course.description)}</p>
                    <div class="course-meta">
                        <span>${categoryName}</span>
                        <span>${course.duration} часов</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <div class="course-stats">
                        <div class="stat">
                            <span>👥</span> ${course.students.toLocaleString('ru-RU')}
                        </div>
                        <div class="stat">
                            <span>⭐</span> ${course.rating}
                        </div>
                        <div class="stat">
                            <span>📅</span> ${formatDate(course.date)}
                        </div>
                    </div>
                </div>
            `;
            
            return courseCard;
        }

        function addCourse(name, description, category, duration, level) {
            const courses = JSON.parse(localStorage.getItem('eduCourses')) || [];
            
            const newCourse = {
                id: Date.now(),
                name,
                description,
                category,
                duration,
                level,
                students: Math.floor(Math.random() * 500) + 100,
                rating: (Math.random() * 0.5 + 4.5).toFixed(1),
                progress: 0,
                date: new Date().toISOString().split('T')[0]
            };
            
            courses.push(newCourse);
            localStorage.setItem('eduCourses', JSON.stringify(courses));
            
            loadCourses();
            showNotification('Курс успешно создан!', 'success');
        }

        function stringToColor(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
        }

        function adjustColor(hex, amount) {
            let r = parseInt(hex.substring(1, 3), 16);
            let g = parseInt(hex.substring(3, 5), 16);
            let b = parseInt(hex.substring(5, 7), 16);
            
            r = Math.max(0, Math.min(255, r + amount));
            g = Math.max(0, Math.min(255, g + amount));
            b = Math.max(0, Math.min(255, b + amount));
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }

        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('ru-RU', options);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getCategoryIcon(category) {
            const icons = {
                'javaScript': '⚡',
                'python': '🐍',
                'flask': '🧪',
                'freimwork': '⚛️',
            };
            return icons[category] || '📚';
        }

        function getCategoryName(category) {
            const names = {
                'python': 'Python',
                'javaScript': 'JavaScript',
                'flask': 'Flask',
                'freimwork': 'Фреймворки',
            };
            return names[category] || 'Другое';
        }

        function getLevelText(level) {
            const levels = {
                'beginner': 'Начинающий',
                'intermediate': 'Средний',
                'advanced': 'Продвинутый'
            };
            return levels[level] || 'Любой';
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'notification';
            
            if (type === 'success') {
                notification.style.background = '#28a745';
            } else if (type === 'error') {
                notification.style.background = '#e74c3c';
            } else {
                notification.style.background = '#3498db';
            }
            
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }