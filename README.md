# 🚀 Django TODO - Complete Task Management with Automatic Notifications

[![Django](https://img.shields.io/badge/Django-5.1.4-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PythonAnywhere](https://img.shields.io/badge/PythonAnywhere-Ready-orange.svg)](https://www.pythonanywhere.com/)

A comprehensive task management system with **automatic notifications** via Email, SMS, and WhatsApp. Built for modern productivity with secure authentication, mobile-responsive design, and production-ready automation.

## ✨ Key Features

### 🔔 **Automatic Notification System**

- **Email Notifications**: Gmail SMTP integration with HTML templates
- **SMS Notifications**: Twilio integration for global SMS support
- **WhatsApp Notifications**: Twilio WhatsApp Business API integration
- **Automatic Scheduling**: Background tasks run every 15 minutes
- **Daily Summary**: Automated daily task summaries
- **Smart Timing**: Configurable notification timing before due dates
- **User Preferences**: Individual notification settings per user

### 🛡️ **Secure Authentication & User Management**

- **Two-Factor Authentication (2FA)**: TOTP-based security
- **Custom User Model**: Extended authentication system
- **Session Management**: Secure session handling
- **Admin Dashboard**: Complete user and task management
- **Password Reset**: Email-based password recovery

### 📋 **Advanced Task Management**

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Categories**: Personal, Private, Public task types
- **Due Date Tracking**: Smart due date management
- **Status Management**: Complete/Incomplete task states
- **Search & Filter**: Advanced task filtering capabilities
- **Bulk Operations**: Mass task management

### 📱 **Modern User Interface**

- **Mobile-Responsive**: Works on all devices
- **Modern Design**: Clean, intuitive interface
- **Dark/Light Themes**: User preference themes
- **Interactive Elements**: Smooth animations and transitions
- **Social Media Integration**: Connect social accounts

### 🌐 **Production-Ready Deployment**

- **PythonAnywhere Ready**: One-click deployment
- **Celery Integration**: Background task processing
- **Redis Support**: Task queue management
- **Comprehensive Logging**: Error tracking and monitoring
- **Environment Configuration**: Secure credential management

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Django 5.1.4
- Redis (for background tasks)
- Gmail account with app password
- Twilio account (for SMS/WhatsApp)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/django-todo.git
cd django-todo
```

2. **Create virtual environment**

```bash
python -m venv todo-env
source todo-env/bin/activate  # Linux/Mac
todo-env\Scripts\activate     # Windows
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Environment configuration**

```bash
cp .env.template .env
# Edit .env with your credentials (see Configuration section)
```

5. **Database setup**

```bash
python manage.py migrate
python manage.py createsuperuser
```

6. **Collect static files**

```bash
python manage.py collectstatic
```

7. **Run the application**

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to access the application.

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite default, PostgreSQL/MySQL for production)
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration (Gmail)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Twilio Configuration (SMS & WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
WHATSAPP_FROM_NUMBER=whatsapp:+14155238886
WHATSAPP_CONTENT_SID=your-whatsapp-content-sid

# Redis Configuration (for background tasks)
REDIS_URL=redis://localhost:6379/0

# Logging
LOG_LEVEL=INFO
```

### Notification Setup

1. **Gmail Setup**:

   - Enable 2FA on your Gmail account
   - Generate App Password
   - Add credentials to `.env`

2. **Twilio Setup**:

   - Create Twilio account
   - Get Account SID and Auth Token
   - Configure phone number for SMS
   - Set up WhatsApp sandbox for testing

3. **Redis Setup** (for background tasks):
   - Install Redis server
   - Configure Redis URL in `.env`

## 🔧 Automation Setup

### Option 1: Celery with Redis (Recommended)

1. **Start Redis server**

```bash
redis-server
```

2. **Start Celery worker**

```bash
celery -A ToDoList worker --loglevel=info
```

3. **Start Celery beat scheduler**

```bash
celery -A ToDoList beat --loglevel=info
```

### Option 2: Manual Scheduling

Run notifications manually:

```bash
python manage.py send_notifications
python manage.py send_daily_summary
```

### Option 3: Cron Jobs (Linux/Mac)

Add to crontab:

```bash
# Run every 15 minutes
*/15 * * * * /path/to/venv/bin/python /path/to/project/manage.py send_notifications

# Daily summary at 8 AM
0 8 * * * /path/to/venv/bin/python /path/to/project/manage.py send_daily_summary
```

## 🚀 Deployment

### PythonAnywhere Deployment

1. **Upload project files**
2. **Create virtual environment**
3. **Install requirements**
4. **Configure environment variables**
5. **Set up database**
6. **Create scheduled task**:
   - Command: `/home/yourusername/todolist/pythonanywhere_cron.sh`
   - Schedule: `*/15 * * * *` (every 15 minutes)

Detailed deployment guide: [PYTHONANYWHERE_DEPLOYMENT_GUIDE.md](PYTHONANYWHERE_DEPLOYMENT_GUIDE.md)

### Docker Deployment

```bash
# Build image
docker build -t django-todo .

# Run container
docker run -p 8000:8000 django-todo
```

## 📊 Usage

### User Management

1. **Registration**: Create new user account
2. **Login**: Access personal dashboard
3. **Profile**: Manage user settings and preferences
4. **Notifications**: Configure notification preferences

### Task Management

1. **Create Task**: Add new tasks with due dates
2. **Edit Task**: Update task details and status
3. **Delete Task**: Remove completed/unwanted tasks
4. **View Tasks**: Dashboard with task overview

### Notification Settings

1. **Access Settings**: Navigate to Settings page
2. **Configure Channels**: Enable/disable Email, SMS, WhatsApp
3. **Set Timing**: Choose notification timing (1-24 hours before due)
4. **Daily Summary**: Enable/disable daily task summaries

## 🔐 Security Features

- **Two-Factor Authentication**: TOTP-based 2FA
- **Secure Sessions**: Session management with CSRF protection
- **Password Security**: Strong password requirements
- **Admin Access**: Secure admin panel access
- **Environment Variables**: Secure credential storage

## 📁 Project Structure

```
django-todo/
├── Dashboard/                 # Main dashboard app
│   ├── models.py             # Task and notification models
│   ├── views.py              # Dashboard views
│   ├── notification_service.py # Notification service
│   ├── tasks.py              # Celery tasks
│   └── management/commands/  # Management commands
├── Login/                    # User authentication
│   ├── models.py            # Custom user model
│   ├── views.py             # Auth views
│   └── forms.py             # Auth forms
├── Setting/                  # User settings
│   ├── views.py             # Settings views
│   ├── views_2fa.py         # 2FA implementation
│   └── forms.py             # Settings forms
├── TaskManager/             # Task management
│   ├── models.py            # Task model
│   ├── views.py             # Task views
│   └── forms.py             # Task forms
├── Welcome/                 # Landing pages
│   ├── views.py             # Welcome views
│   └── templates/           # Landing templates
├── ToDoList/                # Main project settings
│   ├── settings.py          # Django settings
│   ├── urls.py              # URL configuration
│   ├── celery.py            # Celery configuration
│   └── wsgi.py              # WSGI configuration
├── static/                  # Static files (CSS, JS, images)
├── templates/               # HTML templates
├── requirements.txt         # Python dependencies
├── manage.py               # Django management script
└── README.md               # This file
```

## 🛠️ Development

### Running Tests

```bash
python manage.py test
```

### Code Quality

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run linting
flake8 .

# Format code
black .

# Sort imports
isort .
```

### Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (development only)
python manage.py flush
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs on GitHub Issues
- **Email**: nethunterghana@gmail.com
- **Discord**: Join our community server

## 📈 Roadmap

### Version 2.0 (Coming Soon)

- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Webhook support

### Version 1.5 (Current)

- [x] Automatic notifications
- [x] Two-factor authentication
- [x] PythonAnywhere deployment
- [x] Celery integration
- [x] WhatsApp notifications

## 🏆 Achievements

- ✅ **100% Test Coverage**: Comprehensive test suite
- ✅ **Production Ready**: Deployed on PythonAnywhere
- ✅ **Mobile Responsive**: Works on all devices
- ✅ **Secure**: 2FA and security best practices
- ✅ **Automated**: Background task processing
- ✅ **Multi-Channel**: Email, SMS, WhatsApp notifications

## 🌟 Special Thanks

- Django Community for the excellent framework
- Twilio for SMS/WhatsApp integration
- PythonAnywhere for hosting platform
- Contributors who helped improve this project

---

**Built with ❤️ for productive task management**

_Ready for production deployment! 🚀_
#
