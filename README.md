# Web Development Final Project - *ReactHub*

Submitted by: **Kuangzhong Niu**

This web app: **ReactHub is a React-focused community forum where developers can ask questions, share helpful resources, and discuss React-related topics. Users can create, edit, delete, and interact with posts through comments and upvotes. The platform also features post categories, search and filtering, video sharing, and a pseudo-authentication system using secret keys to manage posts and comments.**

Time spent: **40~45** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [x] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [x] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] List anything else that you added to improve the site's functionality!
- Improved user experience by displaying success and error status messages after user actions.
- Added form validation to prevent invalid or incomplete submissions.
- Added empty-state messages when no posts match the current search or filters.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

Full Video: https://youtu.be/TLNaO1paK7c

<!-- Replace this with whatever GIF tool you used! -->
<!-- GIF created with ...   -->
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

One challenge I encountered was managing shared state between components. I placed the search input in Header.jsx, while the posts were fetched and displayed in App.jsx. Initially, I wasn't sure how to make the search input's state accessible to App.jsx. After a while, I figured that I could use useOutletContext, which allowed me to share the search state through the parent Layout.jsx. Overall, developing this app was a really fun and rewarding experience. I learned a lot about React, state management, React Router, and integrating Supabase. It also helped me become more comfortable breaking down problems and finding solutions independently.

## License

    Copyright [2026] [KN]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.