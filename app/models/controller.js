'use strict';

angular.module('forum')
    .controller('HomeController', ['$scope', '$http', '$window', '$state', function($scope, $http, $window, $state){
        if($window.sessionStorage.token){
            $state.go('topics');
        }
    }])
    
    .controller('HeaderController',['$scope', '$http', '$window', '$state', function($scope, $http, $window, $state){
        $scope.logged = false;
        if($window.sessionStorage.token){
            $scope.logged = true;
        }
        
        $scope.topics = function(){
            $state.go('topics');
        }
        
        $scope.logout = function(){
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.role;
            delete $window.sessionStorage.name;
            $state.go('login');
        }
    }])
    
    .controller('LoginController', ['$scope', '$http', '$window', '$state', function($scope, $http, $window, $state){
        
        if($window.sessionStorage.token){
            $state.go('topics');
        }
        $scope.message = "";
        $scope.success = false;
        $scope.error = false;
        $scope.user = {};
        $scope.userInfo = {};
        $scope.login = function(){
            $http.post('//104.131.4.157/login', $scope.user)
                .success(function(content){
                    $scope.success = true;
                    $scope.error = false;
                    $scope.message = content.status;
                    $window.sessionStorage.token = content.token;
                    $window.sessionStorage.role  = content.role;
                    $window.sessionStorage.name  = content.name;
                    setTimeout(function(){
                        $state.go('topics');
                    }, 1000);
                })
                .error(function(content){
                    delete $window.sessionStorage.token;
                    $scope.error = true;
                    $scope.success = false;
                    $scope.message = content.err.message;
                });
                
            
        }
    }])
    
    .controller('SignupController', ['$scope', '$http', '$state', 'authInterceptor', function($scope, $http, $state, authInterceptor){
        
        $scope.message = "";
        $scope.success = false;
        $scope.error = false;
        $scope.user = {};
        $scope.user.role = "User";
        $scope.signup = function(){
            $http.post('//104.131.4.157/register', $scope.user)
                .success(function(content){
                    $scope.success = true;
                    $scope.error = false;
                    $scope.message = content.status;
                    setTimeout(function(){
                        $state.go('login');
                    }, 1000);
                })
                .error(function(content){
                    $scope.error = true;
                    $scope.success = false;
                    $scope.message = content.err.message;
                });
        }
    }])

    .controller('TopicController', ['$scope', '$http', '$window', '$state', function($scope, $http, $window, $state){
        
        if(!$window.sessionStorage.token){
            $state.go('login');
        }
        
        $scope.role = true;
        if($window.sessionStorage.role == 'Admin' || $window.sessionStorage.role == "Moderator"){
            $scope.role = false;
        }
        
        $scope.t = {};
        $scope.topics = {};
        $scope.t.author = $window.sessionStorage.name;
        
        
        $http.get('//104.131.4.157/api/topics').success(function(content){
            $scope.topics = content;
        });
        
        $scope.edit = new Array();
        
        $scope.addTopic = function(){
            $http.post('//104.131.4.157/api/topics', $scope.t).success(function(content){
                $scope.topics.push(content);
                $scope.t.name = "";
            });
        };
        
        $scope.editTopic = function(top){
            var index = $scope.topics.indexOf(top);
            $scope.edit[index] = true;
        };
        
        $scope.updateTopic = function(top){
            $http.put('http://104.131.4.157/api/topics/'+ top._id, top).success(function(content){
                var index = $scope.topics.indexOf(top);
                $scope.edit[index] = false;
            });
        };
        
        $scope.deleteTopic = function(top){
            $http.delete('//104.131.4.157/api/topics/' + top._id).success(function(content){
                var index = $scope.topics.indexOf(top);
                if(index > -1){
                    $scope.topics.splice(index, 1);
                }
            })
        };
        
        $scope.upvoteTopic = function(top){
            $http.put('//104.131.4.157/api/topics/' + top._id + '/vote').success(function(content){
                var index = $scope.topics.indexOf(top);
                if(index > -1){
                    $scope.topics[index].votes++;
                }
            });
        };
    }])
    
    .controller('PostController', ['$scope', '$http', '$stateParams', '$window', '$state', function($scope, $http, $stateParams, $window, $state){
        
        if(!$window.sessionStorage.token){
            $state.go('login');
        }
        
        $scope.role = true;
        if($window.sessionStorage.role == 'Admin' || $window.sessionStorage.role == "Author"){
            $scope.role = false;
        }
        
        $scope.topicid = $stateParams.topicid;
        $scope.topic = {};
        
        $scope.p = {};
        $scope.p.author = $window.sessionStorage.name;
        
        $http.get('api/topics/'+$scope.topicid).success(function(content){
            //$scope.topics = content;
            $scope.topic = content;;
        });
        
        $scope.edit = new Array();
        
        $scope.addPost = function(){
            $http.post('api/topics/' + $scope.topicid + '/post', $scope.p).success(function(content){
                $scope.topic.posts.push(content);
                $scope.p.title = "";
            });
        };
        
        $scope.editPost = function(post){
            var index = $scope.topic.posts.indexOf(post);
            $scope.edit[index] = true;
        };
        
        $scope.updatePost = function(post){
            $http.put('api/topics/' + $scope.topicid + '/post/' + post._id, post).success(function(content){
                var index = $scope.topic.posts.indexOf(post);
                $scope.edit[index] = false;
            });
            
        };
        
        $scope.deletePost = function(post){
            $http.delete('api/topics/' + $scope.topicid + '/post/' + post._id).success(function(content){
                var index = $scope.topic.posts.indexOf(post);
                if(index > -1){
                    $scope.topic.posts.splice(index, 1);
                }
            });
        };
        
        $scope.upvotePost = function(post){
            $http.put('api/topics/' + $scope.topicid + '/post/' + post._id + '/vote').success(function(content){
                var index = $scope.topic.posts.indexOf(post);
                if(index > -1){
                    $scope.topic.posts[index].votes++;
                }
            });
        };
        
    }])
    
    .controller('CommentController', ['$scope', '$http', '$stateParams', '$window', '$state', function($scope, $http, $stateParams, $window, $state){
        
        if(!$window.sessionStorage.token){
            $state.go('login');
        }
        
        $scope.role = true;
        if($window.sessionStorage.role == 'Admin'){
            $scope.role = false;
        }
        
        $scope.topicid = $stateParams.topicid;
        $scope.postid = $stateParams.postid;
        $scope.topicName = $stateParams.topicName;
        
        $scope.post = {};
        $scope.c = {};
        $scope.c.author = $window.sessionStorage.name;
        
        
        $http.get('api/topics/' + $scope.topicid + '/post/' + $scope.postid).success(function(content){
            $scope.post = content;
        });
        
        $scope.edit = new Array();
        
        $scope.addComment = function(){
            $http.post('api/topics/' + $scope.topicid + '/post/' + $scope.postid + '/comment', $scope.c).success(function(content){
                $scope.post.comments.push(content);
                $scope.c.body = "";
            });
        };
        
        $scope.editComment = function(comment){
            var index = $scope.post.comments.indexOf(comment);
            $scope.edit[index] = true;
        };
        
        $scope.updateComment = function(comment){
            $http.put('api/topics/' + $scope.topicid + '/post/' + $scope.postid + '/comment/' + comment._id, comment).success(function(content){
                var index = $scope.post.comments.indexOf(comment);
                $scope.edit[index] = false;
            });
            
        };
        
        $scope.deleteComment = function(comment){
            $http.delete('api/topics/' + $scope.topicid + '/post/' + $scope.postid + '/comment/' + comment._id).success(function(content){
                var index = $scope.post.comments.indexOf(comment);
                if(index > -1){
                    $scope.post.comments.splice(index, 1);
                }
            });
        };
        
        $scope.upvoteComment = function(comment){
            $http.put('api/topics/' + $scope.topicid + '/post/' + $scope.postid + '/comment/' + comment._id + '/vote').success(function(content){
                var index = $scope.post.comments.indexOf(comment);
                if(index > -1){
                    $scope.post.comments[index].votes++;
                }
            });
        };
        
    }]);
