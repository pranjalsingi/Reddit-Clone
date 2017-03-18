'use strict';

angular.module('forum', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        
        $urlRouterProvider.otherwise('/home');
        
		 $stateProvider
            // route for the home page
            .state('app', {
                url:'/home',
                views: {
                    'header' : {
                        templateUrl : 'app/views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'app/views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'app/views/footer.html',
                    }
                }
            })
            
            .state('login',{
                url:'/login',
                views: {
                    'content@'  : {
                        templateUrl : 'app/views/login.html',
                        controller  : 'LoginController'
                    }
                }
            })
            
            .state('signup',{
                url:'/signup',
                views: {
                    'content@'  : {
                        templateUrl : 'app/views/signup.html',
                        controller  : 'SignupController'
                    }
                }
            })
            
            
            .state('topics', {
                url:'/topics',
                views: {
                    'header' : {
                        templateUrl : 'app/views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'app/views/topics.html',
                        controller  : 'TopicController'
                    },
                    'footer': {
                        templateUrl : 'app/views/footer.html',
                    }
                }
            })
            
            
            .state('topics.posts', {
                url:'/:topicid',
                views: {
                    'content@' : {
                        templateUrl : 'app/views/posts.html',
                        controller  : 'PostController'
                    }
                }
            })
            
            .state('topics.comments', {
                url: '/:topicid/:topicName/post/:postid',
                views: {
                    'content@' : {
                        templateUrl : 'app/views/comments.html',
                        controller : 'CommentController'
                    }
                }
            });
            
            $httpProvider.interceptors.push('authInterceptor');
    });
