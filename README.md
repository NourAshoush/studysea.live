# StudySea: A Social Studying Platform
StudySea is a unique social studying platform designed to enhance productivity, foster collaboration, and minimize distractions. It combines the effectiveness of the Pomodoro technique, a task planner, and a study motivation website, creating an environment that encourages students to work efficiently towards their academic goals while incorporating a social and collaborative element.
![StudySea Logo](https://github.com/NourAshoush/studysea.live/blob/main/images/image11.png)

## Key Features
StudySea revolves around the concept of a shared study room linked to user tasks. Users can join their friends' study sessions, customize their own task details, and benefit from a synchronized real-time study/break timer. The standout feature of StudySea is that users can only interact during designated break periods. This approach emulates the experience of real-life group study while providing a digital platform for collaborative learning, which became especially relevant during the global shift to online education in 2020. Additionally, StudySea offers a range of features, including a feed, league system, and friends system, further enhancing the user experience.

## Landing Page and Homepage
Upon navigating to StudySea's website, users are greeted by an aesthetically pleasing landing page featuring a modern wave animation on a dark blue background. The landing page showcases the StudySea logo and a single button labeled "Enter StudySea." A consistent visual style is maintained throughout the platform, including interactive hover effects on buttons. The footer of each page contains the mandatory project disclaimer, accessible through a click.
![Landing Page](https://github.com/NourAshoush/studysea.live/blob/main/images/image1.png)

Clicking the "Enter StudySea" button redirects users to the homepage, where they can easily navigate to different sections of the platform, such as the league page. The homepage features a navigation bar in the header, except during study and break sessions. The left side of the page displays users' scheduled tasks, allowing effective planning and easy deletion of tasks. The top right corner provides an option to start an instant study session, opening a modal where users can input session details for immediate commencement. Users can also choose to find a study buddy, which lists all ongoing study sessions across the platform. However, the participants' identities are concealed until joining a session. The center of the homepage offers an introduction to the app and a dropdown explaining the Pomodoro technique for new users.
![Homepage](https://github.com/NourAshoush/studysea.live/blob/main/images/image5.png)

## Task Planning and Study Sessions
The "Create Task" feature on the homepage is a simple yet essential tool for task planning within the app. Clicking the "Create Task" button opens a modal dialog window where users can enter their task's start time, study length, break length, title, and subject. Default values are provided for convenience. Saving the task triggers a POST request to the database, creating a new task associated with the user. The user's tasks are displayed chronologically on their homepage.
![Creating New Task](https://github.com/NourAshoush/studysea.live/blob/main/images/image9.png)
![Displayed Tasks](https://github.com/NourAshoush/studysea.live/blob/main/images/image14.png)


Study Sessions serve as the core element of StudySea. They consist of three main pages: the study timer page, the break page, and the "post study" page. Users can initiate a session by creating a scheduled task or an instant study session. Although both methods function similarly, instant study sessions create hidden tasks in the database for seamless integration. An ephemeral study session is created alongside the task to store member lists and the session's actual start time. The timer page displays a countdown based on the selected study length, allowing users to join the session at any time. A progress bar beneath the timer visually represents the elapsed time within the study block. Upon completing the study block, users are automatically redirected to the break page.
![Active Study Session Block](https://github.com/NourAshoush/studysea.live/blob/main/images/image10.png)

## Breaks and Social Interaction
During breaks, users can relax and interact with others in their study session. The break page comprises a timer with an aesthetically pleasing wave animation, session information, and a chat feature. The session information displays user details, such as chat message colors, session/task information, completed blocks, time spent studying, and an exit session button. The chatbox fosters communication among participants and provides a supportive atmosphere. Users can send messages, view message history, and receive real-time notifications of new messages. To minimize distractions, the chat feature is disabled during study sessions, ensuring users can solely focus on their work.
![Study Session Break](https://github.com/NourAshoush/studysea.live/blob/main/images/image8.png)

## Profile Customization and Settings
StudySea allows users to customize their profiles to reflect their personality and academic goals. The profile page features an avatar, display name, bio, and customizable visual preferences. Users can choose from a variety of avatars or upload their own profile pictures. The display name and bio provide a brief introduction to other users. Moreover, StudySea offers visual customization options, including font size, style, and theme selection. The available themes include light, dark, and high contrast, ensuring accessibility and user comfort.

The settings page provides further customization options. Users can modify account settings, such as changing their password, updating email addresses, and managing notification preferences. In addition, they can set privacy options, control who can see their profile information, and manage friend requests. StudySea respects user privacy and ensures that settings are user-centric, providing control over personal data and interactions.

## Feed, League Tables, and Analytics
StudySea incorporates a feed feature to facilitate social interactions and engagement. Users can create posts, share updates, and view their friends' posts on the feed page. The posts can include study tips, motivational quotes, or academic achievements, fostering a sense of community and support. Users can like, comment on, delete, and report posts and comments, ensuring a safe and friendly environment.

To enhance motivation and friendly competition, StudySea introduces league tables. Users can create leagues within their friend groups to track individual study achievements. The leagues display participants' study times, allowing users to compare and celebrate their progress.

StudySea also provides analytics to help users review their study progress. The analytics page presents visualizations, including topic allocation charts, overall study time summaries, and information about the least-studied topics. These insights empower users to identify areas for improvement and optimize their study routines.

## Conclusion
StudySea is an innovative social studying platform that combines productivity-enhancing features, collaborative learning, and a supportive community. By incorporating the Pomodoro technique, task planning, and social interaction, StudySea creates an engaging and effective environment for students to achieve their academic goals. With its intuitive interface, appealing visual identity, and thoughtful features, StudySea aims to revolutionize the way students study and collaborate online, ultimately improving their learning outcomes and academic experiences.
