# Real Estate CRM with AI Integration

A comprehensive Customer Relationship Management (CRM) system specifically designed for real estate professionals, featuring AI-powered property analysis, lead scoring, and market insights.

## 🏠 Features

### Core CRM Features
- **User Management**: Role-based access control (Admin, Manager, Customer)
- **Customer Management**: Complete customer lifecycle management
- **Property Management**: Comprehensive property listing and management
- **Authentication**: Secure JWT-based authentication
- **Responsive UI**: Modern, mobile-friendly interface

### AI-Powered Features
- **Property Analysis**: AI analyzes properties for market value, lead scoring, and recommendations
- **Lead Scoring**: Automatic lead scoring based on customer profiles and property interest
- **Market Analysis**: Real-time market insights and trends for any city or region
- **Smart Recommendations**: AI-powered property recommendations for customers

### Real Estate Specific Features
- **Property Types**: Support for various property types (Single Family, Condo, Townhouse, etc.)
- **Property Status**: Track properties through different stages (For Sale, Sold, For Rent, etc.)
- **Advanced Search**: Filter properties by location, price, bedrooms, bathrooms, and more
- **Property Viewings**: Schedule and manage property viewings
- **Statistics Dashboard**: Comprehensive analytics and reporting

## 🚀 Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** with JWT
- **Spring Data JPA**
- **PostgreSQL** Database
- **OpenAI API** for AI features
- **Maven** for dependency management

### Frontend
- **React 18** with TypeScript
- **React Router DOM** for routing
- **React Hook Form** for form management
- **Axios** for API calls
- **Lucide React** for icons
- **Tailwind CSS** for styling

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL database
- OpenAI API key (for AI features)

## 🛠️ Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm_adv/crm_backend
   ```

2. **Configure Database**
   - Update `application.properties` with your PostgreSQL credentials
   - Ensure PostgreSQL is running

3. **Configure AI API**
   - Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
   - Update `ai.api.key` in `application.properties`

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will be available at `http://localhost:9090`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd crm_adv/crm_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/real_estate_crm
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-jwt-secret-key

# AI Configuration
ai.api.key=your-openai-api-key
ai.api.url=https://api.openai.com/v1/chat/completions
```

#### Frontend
Update the API base URL in `src/services/api.ts` if your backend runs on a different port.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - Get paginated customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Properties
- `GET /api/properties` - Get paginated properties with filters
- `POST /api/properties` - Create new property
- `GET /api/properties/{id}` - Get property by ID
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/stats` - Get property statistics
- `POST /api/properties/{id}/analyze` - Analyze property with AI
- `GET /api/properties/market-analysis` - Get market analysis

## 🤖 AI Features

### Property Analysis
The AI service analyzes each property and provides:
- **Estimated Market Value**: AI-calculated property valuation
- **Market Analysis**: Current market conditions and trends
- **Lead Score**: Scoring from 1-100 based on property attractiveness
- **Recommendations**: AI-generated suggestions for pricing and marketing

### Lead Scoring
AI automatically scores leads based on:
- Customer profile completeness
- Property interest alignment
- Communication history
- Company background

### Market Analysis
Get real-time market insights including:
- Current market trends (buyer's/seller's market)
- Average home prices and price trends
- Inventory levels and days on market
- Predictions for the next 6 months

## 🎨 UI Components

### Dashboard
- Overview statistics
- Recent activities
- Quick actions
- AI insights panel

### Property Management
- Property listing with advanced filters
- Property creation and editing forms
- AI analysis display
- Image and media management

### Customer Management
- Customer listing and search
- Customer profile management
- Lead scoring display
- Communication tracking

## 🔐 Security

- JWT-based authentication
- Role-based access control
- CORS configuration for frontend
- Input validation and sanitization
- Secure password hashing

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```

2. Run the application:
   ```bash
   java -jar target/crm-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- [ ] Document management system
- [ ] AI chatbot for customer support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with MLS systems
- [ ] Virtual tour integration
- [ ] Email marketing automation
- [ ] Calendar integration for viewings

## 📈 Performance

- Backend optimized for high performance
- Frontend uses React best practices
- Database queries optimized with proper indexing
- AI API calls are cached to reduce costs
- Responsive design ensures fast loading

---

**Built with ❤️ for real estate professionals**