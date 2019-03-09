# ECS_165_Instagram_App

## Features

### Sign Up
User specifies their name, username, birthday, email, and password to create an account. Accounts are created using Firebase authentication and profile information is stored in our Cloud Firestore Database. Firebase Authentication allows us to create rules on emails and passwords that may be used to sign up.

Upon signup, a user is directed to edit their profile. They may write a bio and their interests and choose a profile picture. Until they choose a profile picture, a default picture is stored. A profile picture must be square and may be selected either from the device camera or the device storage. This information is stored in our database.

### Log In
To log in, a user enters their email and password. This is handled by Firebase Authentication. After logging in, a user is directed to their Home Screen.

### Home Screen (Activity Feed)
The Home Screen, also known as the user's Activity Feed, uses an algorithm to display relevant and recent posts to the user. The user may load more posts as they scroll, though note that posts that are deemed too old or irrelevant may not display. Only posts from users the current user follows or the current user's posts will display.

The user may like or comment on any post. To comment, the user clicks on the comment icon and can see other comments and add their own.

The Home Screen and several other screens have a navigation bar at the bottom. This navigation bar also includes Search, New Post, User Profile, and Updates. Each of these is elaborated below.

### Search
The search screen has a swipeable tab view that allows a user to select whether they want to search for other users or hashtags. Users will either see suggestions for popular users with posts matching this user's interests or trending hashtags, depending on which tab is in view.

#### People Search

When searching for other users, the users that the current user follows will display at the top, followed by other "matches." A match is defined as a user for which the first and last name combined or the username contains the current string in the search bar. When a user clicks on a search result, they are directed to that user's profile.


#### Tag Search

When searching for hashtags, the search results include any hashtags from the Cloud Firestore Database which contain the current string in the search bar. Clicking on a tag will show a special view that looks like an Activity Feed that includes all posts with that hashtag.

### Creating a Post
There are two ways to select a photo for a post: Camera or Upload. After selecting a photo, the user may add a caption and hashtags. Upon hitting post, relevant information is added to the Cloud Firestore Database and the image is sent to the Google Cloud Vision API to be sorted into buckets.

#### Camera
The user is asked for permission to use the Camera if permission has not previously been granted. The user takes a photo, confirms the photo and chooses a square region for cropping.

#### Upload
The user is asked for permission to access photos on the device is permission has not previously been granted. The user selects a photo and chooses a square region for cropping.

### Viewing a Profile
The user may view their own profile from the navigation bar or others' profiles from a variety of navigations.

#### User's Own Profile
The user may view their profile or choose to edit their profile. The profile view contains a sidescrolling list of followers and people the user follows, along with a photo grid displaying the user's photos. Clicking on a profile image navigates the user to that user's profile, and clicking on a photo in the photo grid opens a view containing the associated post. The user can swipe to either side to view other posts.

#### Other Users' Profiles
The view for other users' profiles is very similar, but instead of being able to edit the profile, the user is given the option to follow (or unfollow) the user. The bottom navigation bar is also not present.

### Viewing your Updates
The updates screen displays updates for the user based on the actions of other users. These updates are also given to the user via push notifications. There are four main types of updates: Follow, Comment, Like, Mention

#### Follow
The user is updated when another user follows them.

#### Comment
The user receives one dynamic update for any comments on a post they created.

#### Like
The user receives one dynamic update for any likes on a post they created.

#### Mention
The user receives an update any time they are mentioned in a post or comment. A mention is @{username}.

## Behind the Scenes

### Firebase Storage
We use Firebase Storage for all photos that are uploaded trhough the app. There is a folder for Posts and a folder for Profile Pictures. Firebase gives us a uri to access the photos.

### Firebase Authentication
Firebase Authentication has support for multiple types of user login. We use a standard email/password system. Using Firebase rules, we only allow users with unique emails, and passwords must be more than 6 characters.

### Cloud Firestore Database
After much consideration, our UI interfaces directly with our Cloud Firestore Dtabase collections. All users, posts, photos, comments, reactions, tags, follows, and updates are stored in the database and directly accessed. One downside to this is that there is very limited local caching of the data, so the user will have limited functionality without internet access.

### Google Cloud Vision
All photos uploaded to the app for a post are automatically tagged via the Google Cloud Vision API. One of the reasons our app is so user-friendly is that we do a lot of behind the scenes work to curate the user's Activity Feed and search results based on their interests.

## UI Styling

Much of our UI is styled with a combination of default react native components and native base components. Native base allowed us to create the headers and navigation bar, and we were able to create an app that feels similar on both iOS and Android because of native base.

## Time Constraints

With just a couple months to create this app, we could not implement all the features we wanted. Here are some features we wish we could have implemented given more time:

- Facial recognition to tag users in photos.
- Multiple photos in a post
- Saving photos locally when device is offline for future upload
- Multiple reaction types
- Audio and gifs in upload
- Image editing such as filters
