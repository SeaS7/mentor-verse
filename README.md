# Mentor Verse

Mentor Verse is a web-based mentorship platform where students can connect with experienced mentors to seek guidance, ask questions, and gain knowledge, similar to Stack Overflow but with a structured mentorship system.

🌍 **Live Demo**: [Mentor Verse](https://mentor-verse-ecru.vercel.app/)

## 🚀 Features

- **Mentor-Student Interaction**: Students can ask questions and receive expert guidance.
- **Session Management**: Admins can monitor mentor-student interactions.
- **Payment Gateway Integration**: Secure payments for mentorship sessions.
- **Role-Based Access**: Separate dashboards for students, mentors, and admins.
- **Real-Time Notifications**: Stay updated with session updates and responses.
- **User Authentication**: Secure login and authentication with NextAuth.js.

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Payment Gateway**: Stripe (or any other payment service)
- **Cloud Storage**: Cloudinary
- **Email Service**: Resend
- **Firebase**: Live Chat & Notifications
- **Deployment**: Vercel

## 🔧 Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/mentor-verse.git
   cd mentor-verse
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables** (Create a `.env.local` file and add the following)
   ```env
   MONGODB_URI=mongodb+srv://your-mongodb-url
   NEXTAUTH_SECRET=your-nextauth-secret
   DOMAIN=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=your-resend-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   ```

4. **Run the development server**
   ```sh
   npm run dev
   ```

5. **Open the app in your browser**
   ```
   http://localhost:3000
   ```

## 📦 Deployment

Mentor Verse is deployed on **Vercel**. To deploy manually, run:
```sh
vercel
```
Ensure that the environment variables are set in the **Vercel Dashboard** under **Project Settings > Environment Variables**.

## 📸 Screenshots

![Mentor Verse Banner-10](https://github.com/user-attachments/assets/2f3e4acb-89e6-45cc-a7de-1491715ef343)
![Login](https://github.com/user-attachments/assets/f4b427a7-7a39-4c95-b03d-cdb2e4f8c481)
![Listing](https://github.com/user-attachments/assets/b7fabc28-d6e2-403b-a386-cfd95dd7c255)
![frontPage](https://github.com/user-attachments/assets/f94e6f89-f773-4920-8a05-2f585e17b62b)
![AskQuestionPage](https://github.com/user-attachments/assets/595c1404-1240-4092-b3bd-fff0fbc81708)
![AnswerPage](https://github.com/user-attachments/assets/653b9f41-6bc7-48e1-880d-1ec71dfe117d)
![userProfile](https://github.com/user-attachments/assets/f1b9e2ce-5527-4147-82a4-2a63a52dd015)
![session page](https://github.com/user-attachments/assets/bffb0d13-81f9-40ae-b683-27dee19725a3)


![MentorProfile](https://github.com/user-attachments/assets/fec787d0-8a18-4d8c-81bb-328a0c45260d)![questionListingPage](https://github.com/user-attachments/assets/130f2360-0483-4ca8-a062-795fb14fea5b)
![paymentGateWay](https://github.com/user-attachments/assets/a96c9de2-0890-4c97-93f9-aa56cd08caf7)
![notification](https://github.com/user-attachments/assets/4f891829-b309-4fe5-a140-89581c98e707)
![MentorsListingPage](https://github.com/user-attachments/assets/ae4deb2c-033a-419f-9f88-dcff6df03a83)


💡 **Have a question?** Reach out to the team! 🚀
