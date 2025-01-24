
<h1 align="center">Mental Health Analysis System</h1>

![alt text](https://github.com/Avirupsett/Mental-Health-Analysis/blob/master/Data%20flow%20diagram_%20Level%202.png)

<h1 align="center"> WorkFlow Of MENTRIX </h1>
![alt text](https://github.com/Avirupsett/Mental-Health-Analysis/blob/master/Neutral%20Flowchart%20Template.png)

## Overview
This system is designed to analyze and monitor users' mental health through a combination of questionnaires, social media tracking, and personalized feedback. The data flow diagram illustrates the process from user registration to ongoing monitoring and personalized reporting.

## System Components

### 1. User Authentication and Information
- Checking Valid User (1.0)
- Get User Info (2.0)
- User Master: Stores user information

### 2. Questionnaire Management
- Complete the Q and A Assignment (3.0)
- Analyze User Responses (4.0)

### 3. Feedback System
- Provide Feedback (5.0)
- Feedback Master: Stores feedback data

### 4. Social Media Tracking
- Track Social Media of the User (6.0)
- Analyze Comments and Post (7.0)

### 5. Reporting and Monitoring
- Generate Report at the end of the day (8.0)
- Send personalized Email to the User (8.1)
- Monitor the Progress Over Time (9.0)
- Tracking Master: Stores tracking data

## Process Flow

1. User enters the system and is authenticated.
2. User information is retrieved or collected.
3. User completes assigned questionnaires.
4. System analyzes user responses.
5. Feedback is provided to the user based on their responses.
6. System tracks user's social media activity.
7. Social media posts and comments are analyzed.
8. Daily reports are generated, including personalized emails to users.
9. User progress is monitored over time.

## Data Storage
- User Master: Stores user account information
- Feedback Master: Stores feedback data
- Tracking Master: Stores progress tracking data

## Key Features
- User authentication and profile management
- Questionnaire administration and analysis
- Social media tracking and analysis
- Personalized feedback and reporting
- Progress monitoring over time

## Security and Privacy
- Ensure all user data is securely stored and handled in compliance with relevant data protection regulations.
- Implement robust authentication mechanisms to protect user accounts.
- Apply encryption for sensitive data storage and transmission.

## Future Enhancements
- Integration with webcam for real-time mood tracking
- Machine learning algorithms for improved analysis and predictions
- Expansion of social media platforms tracked
- Development of a mobile application for easier user access
