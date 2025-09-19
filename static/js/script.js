document.addEventListener('DOMContentLoaded', function() {
            // Загрузка курсов из localStorage
            loadCourses();

            // Обработка формы добавления курса
            document.getElementById('course-form').addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('course-name').value;
                const description = document.getElementById('course-description').value;
                const category = document.getElementById('course-category').value;
                const duration = document.getElementById('course-duration').value;
                const level = document.getElementById('course-level').value;

                addCourse(name, description, category, duration, level);

                this.reset();
            });

            document.getElementById('delete-all-btn').addEventListener('click', function() {
                deleteAllCourses();
            });
        });
        // Функция удаления всех курсов
        function deleteAllCourses() {
            // Проверяем, есть ли вообще курсы для удаления
            const courses = JSON.parse(localStorage.getItem('eduCourses')) || [];
            if (courses.length === 0) {
                showNotification('Нет курсов для удаления!', 'info');
                return;
            }
            
            // Простое подтверждение через confirm()
            const isConfirmed = confirm('⚠️ Вы уверены, что хотите удалить ВСЕ курсы? Это действие нельзя отменить!');
            
            if (isConfirmed) {
                // Удаляем все курсы из localStorage
                localStorage.removeItem('eduCourses');
                
                // Перезагружаем список курсов
                loadCourses();
                
                // Показываем уведомление
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
                        category: "programming",
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
                        category: "programming",
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
                        category: "programming",
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
            
            courses.forEach(course => {
                const courseCard = createCourseCard(course);
                coursesContainer.appendChild(courseCard);
            });
        }
        function createCourseCard(course) {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            const colorHash = stringToColor(course.category);
            const darkerColor = adjustColor(colorHash, -40);
            
            const categoryIcon = getCategoryIcon(course.category);
            const levelText = getLevelText(course.level);
            
            courseCard.innerHTML = `
                <div class="course-badge">${levelText}</div>
                <div class="course-image" style="background: linear-gradient(135deg, ${colorHash} 0%, ${darkerColor} 100%)">
                    <div style="font-size: 60px; color: white;">${categoryIcon}</div>
                </div>
                <div class="course-info">
                    <h3 class="course-title">${escapeHtml(course.name)}</h3>
                    <p class="course-description">${escapeHtml(course.description)}</p>
                    <div class="course-meta">
                        <span>${getCategoryName(course.category)}</span>
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
        function addCourse(name, description, category, price, duration, level) {
            const courses = JSON.parse(localStorage.getItem('eduCourses')) || [];
            
            const newCourse = {
                id: Date.now(),
                name,
                description,
                category,
                price,
                duration,
                level,
                students: Math.floor(Math.random() * 500) + 100, // ПОТОМ УДАЛИТЬ ВСЕ НА НУЛИ
                rating: (Math.random() * 0.5 + 4.5).toFixed(1), 
                progress: 0, 
                date: new Date().toISOString().split('T')[0]
            };
            
            courses.push(newCourse);
            localStorage.setItem('eduCourses', JSON.stringify(courses));
            

            loadCourses();
            
            document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
            
            alert('Курс успешно создан!'); // АЛЕРТ ТОЛЬКО ДЛЯ ПРОВЕРКИ
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
                'programming': '💻',
            };
            return icons[category] || '📚';
        }

        function getCategoryName(category) {
            const names = {
                'programming': 'Программирование',
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

