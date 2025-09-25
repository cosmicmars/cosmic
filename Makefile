.PHONY: install install-dev run dev clean lint format test help uninstall

# Название приложения (будет доступно как команда в терминале)
APP_NAME = cosmic-server
SOURCE = app.py
INSTALL_DIR = /usr/local/bin
PYTHON = python3
PIP = pip                    

# Файл с зависимостями
REQUIREMENTS = requirements.txt

.DEFAULT_GOAL := help

help:
	@echo "Доступные команды:"
	@echo "  make install     - Установка приложения как системной утилиты"
	@echo "  make install-dev - Установка для разработки"
	@echo "  make run         - Запуск приложения напрямую"
	@echo "  make dev         - Запуск в режиме разработки"
	@echo "  make clean       - Очистка временных файлов"
	@echo "  make uninstall   - Удаление приложения из системы"
	@echo "  make lint        - Проверка стиля кода"
	@echo "  make format      - Форматирование кода"

# Установка зависимостей
install-deps:
	$(PIP) install -r $(REQUIREMENTS)

# Установка приложения как системной утилиты
install: install-deps
	@echo "Установка $(APP_NAME) как системной утилиты..."
	@echo "#!/bin/sh" > $(APP_NAME)
	@echo "$(PYTHON) $(PWD)/$(SOURCE) \"\$$@\"" >> $(APP_NAME)
	chmod +x $(APP_NAME)
	sudo mv $(APP_NAME) $(INSTALL_DIR)/
	@echo "Приложение установлено! Запускайте командой: $(APP_NAME)"
	
# Установка для разработки (без системной установки)
install-dev: install-deps
	$(PIP) install black flake8 isort

# Запуск приложения напрямую
run:
	$(PYTHON) $(SOURCE)

# Запуск в режиме разработки (с авто-перезагрузкой, если нужно)
dev:
	$(PYTHON) $(SOURCE) --dev

# Удаление приложения из системы
uninstall:
	sudo rm -f $(INSTALL_DIR)/$(APP_NAME)
	@echo "Приложение удалено из системы"

# Очистка временных файлов
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache .coverage *.egg-info

# Проверка стиля кода
lint:
	flake8 . --ignore=E501,E402
	black --check .
	isort --check-only .

# Форматирование кода
format:
	black .
	isort .

# Создание requirements.txt
requirements:
	$(PIP) freeze > $(REQUIREMENTS)