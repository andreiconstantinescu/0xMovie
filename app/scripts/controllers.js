/**
 * Created by Gabriel on 31/03/15.
 */

/*global console, define*/

define(['angular'], function (angular) {
	'use strict';
	
	return angular.module('MovieScribe.Controllers', [])
		.controller('MainController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'AuthenticationService', 'OMDB', 'MovieScribeAPI', function ($scope, $rootScope, $location, $timeout, $http, AuthenticationService, OMDB, MovieScribeAPI) {
			
			$scope.recommendationInput = "";
			
			$scope.showRecommendations = function () {
				
				console.log("Trying to display notifications");
				
				// TODO improve this
				for (var i = 0 ; i < $scope.movies.length; i++) {
					if ($scope.movies[i].Title.toLocaleLowerCase().indexOf($scope.recommendationInput.toLowerCase()) > -1) {
						$scope.movie = $scope.movies[i];
					}
				}
				
				// Extract movie 
//				var splt = $scope.movie.Poster.split('/')[5];
//				$scope.imageSrc = 'http://86.127.142.109:8080/RecommendationSystem/image/' + splt.substring(0, splt.length - 4);
			};
			
//			$scope.movie = null;
//			MovieScribeAPI.getMovies().then(function (response) {
//				console.log("RESPONSE", response.data);
//				$scope.movies = response.data;
//			});
			$scope.movies = [
				{"Title":"Interstellar","Year":"2014","Rated":"PG-13","Released":"07 Nov 2014","Runtime":"169 min","Genre":"Adventure, Sci-Fi","Director":"Christopher Nolan","Writer":"Jonathan Nolan, Christopher Nolan","Actors":"Ellen Burstyn, Matthew McConaughey, Mackenzie Foy, John Lithgow","Plot":"In the near future, Earth has been devastated by drought and famine, causing a scarcity in food and extreme changes in climate. When humanity is facing extinction, a mysterious rip in the space-time continuum is discovered, giving mankind the opportunity to widen its lifespan. A group of explorers must travel beyond our solar system in search of a planet that can sustain life. The crew of the Endurance are required to think bigger and go further than any human in history as they embark on an interstellar voyage into the unknown. Coop, the pilot of the Endurance, must decide between seeing his children again and the future of the human race.","Language":"English","Country":"USA, UK, Canada","Awards":"Won 1 Oscar. Another 24 wins & 72 nominations.","Poster":"http://static.rogerebert.com/uploads/movie/movie_poster/inception-2010/large_ziKvu3Th9l1wN2aIeVj5ElpBqFu.jpg","Metascore":"74","imdbRating":"8.8","imdbVotes":"484,381","imdbID":"tt0816692","Type":"movie","Response":"True"},
				{"Title":"Boyhood","Year":"2014","Rated":"N/A","Released":"15 Aug 2014","Runtime":"165 min","Genre":"Drama","Director":"Richard Linklater","Writer":"Richard Linklater","Actors":"Ellar Coltrane, Patricia Arquette, Elijah Smith, Lorelei Linklater","Plot":"Filmed over 12 years with the same cast, Richard Linklater's BOYHOOD is a groundbreaking story of growing up as seen through the eyes of a child named Mason (a breakthrough performance by Ellar Coltrane), who literally grows up on screen before our eyes. Starring Ethan Hawke and Patricia Arquette as Mason's parents and newcomer Lorelei Linklater as his sister Samantha, BOYHOOD charts the rocky terrain of childhood like no other film has before. Snapshots of adolescence from road trips and family dinners to birthdays and graduations and all the moments in between become transcendent, set to a soundtrack spanning the years from Coldplay's Yellow to Arcade Fire's Deep Blue. BOYHOOD is both a nostalgic time capsule of the recent past and an ode to growing up and parenting.","Language":"English, Spanish","Country":"USA","Awards":"Won 1 Oscar. Another 158 wins & 123 nominations.","Poster":"http://www.beliefnet.com/columnists/peanutsandpopcorn/files/2014/07/Boyhood.jpg","Metascore":"100","imdbRating":"8.1","imdbVotes":"175,086","imdbID":"tt1065073","Type":"movie","Response":"True"},
				{"Title":"Gone Girl","Year":"2014","Rated":"R","Released":"03 Oct 2014","Runtime":"149 min","Genre":"Drama, Mystery, Thriller","Director":"David Fincher","Writer":"Gillian Flynn (screenplay), Gillian Flynn (novel)","Actors":"Ben Affleck, Rosamund Pike, Neil Patrick Harris, Tyler Perry","Plot":"On the occasion of his fifth wedding anniversary, Nick Dunne reports that his wife, Amy, has gone missing. Under pressure from the police and a growing media frenzy, Nick's portrait of a blissful union begins to crumble. Soon his lies, deceits and strange behavior have everyone asking the same dark question: Did Nick Dunne kill his wife?","Language":"English","Country":"USA","Awards":"Nominated for 1 Oscar. Another 56 wins & 111 nominations.","Poster":"http://ia.media-imdb.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_SX300.jpg","Metascore":"79","imdbRating":"8.2","imdbVotes":"366,585","imdbID":"tt2267998","Type":"movie","Response":"True"},
				{"Title":"The Grand Budapest Hotel","Year":"2014","Rated":"N/A","Released":"28 Mar 2014","Runtime":"99 min","Genre":"Adventure, Comedy, Drama","Director":"Wes Anderson","Writer":"Stefan Zweig (inspired by the writings of), Wes Anderson (screenplay), Wes Anderson (story), Hugo Guinness (story)","Actors":"Ralph Fiennes, F. Murray Abraham, Mathieu Amalric, Adrien Brody","Plot":"GRAND BUDAPEST HOTEL recounts the adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend. The story involves the theft and recovery of a priceless Renaissance painting and the battle for an enormous family fortune -- all against the back-drop of a suddenly and dramatically changing Continent.","Language":"English, French","Country":"USA, Germany, UK","Awards":"Won 4 Oscars. Another 105 wins & 123 nominations.","Poster":"http://macguffin.wpengine.netdna-cdn.com/wp-content/uploads/2014/01/The-Grand-Budapest-Hotel-Movie-Poster-400x600.jpg","Metascore":"88","imdbRating":"8.1","imdbVotes":"304,574","imdbID":"tt2278388","Type":"movie","Response":"True"},
				{"Title":"Edge of Tomorrow","Year":"2014","Rated":"PG-13","Released":"06 Jun 2014","Runtime":"113 min","Genre":"Action, Sci-Fi","Director":"Doug Liman","Writer":"Christopher McQuarrie (screenplay), Jez Butterworth (screenplay), John-Henry Butterworth (screenplay), Hiroshi Sakurazaka (novel)","Actors":"Tom Cruise, Emily Blunt, Brendan Gleeson, Bill Paxton","Plot":"An alien race has hit the Earth in an unrelenting assault, unbeatable by any military unit in the world. Major William Cage (Cruise) is an officer who has never seen a day of combat when he is unceremoniously dropped into what amounts to a suicide mission. Killed within minutes, Cage now finds himself inexplicably thrown into a time loop-forcing him to live out the same brutal combat over and over, fighting and dying again...and again. But with each battle, Cage becomes able to engage the adversaries with increasing skill, alongside Special Forces warrior Rita Vrataski (Blunt). And, as Cage and Vrataski take the fight to the aliens, each repeated encounter gets them one step closer to defeating the enemy!","Language":"English","Country":"USA, Canada","Awards":"10 wins & 17 nominations.","Poster":"http://macguffin.wpengine.netdna-cdn.com/wp-content/uploads/2014/01/Edge-of-Tomorrow-Movie-Poster-400x600.jpg","Metascore":"71","imdbRating":"8.0","imdbVotes":"302,396","imdbID":"tt1631867","Type":"movie","Response":"True"},
				{"Title":"The Fault in Our Stars","Year":"2014","Rated":"N/A","Released":"06 Jun 2014","Runtime":"126 min","Genre":"Drama, Romance","Director":"Josh Boone","Writer":"Scott Neustadter (screenplay), Michael H. Weber (screenplay), John Green (book)","Actors":"Shailene Woodley, Ansel Elgort, Nat Wolff, Laura Dern","Plot":"Hazel and Augustus are two teenagers who share an acerbic wit, a disdain for the conventional, and a love that sweeps them on a journey. Their relationship is all the more miraculous, given that Hazel's other constant companion is an oxygen tank, Gus jokes about his prosthetic leg, and they meet and fall in love at a cancer support group.","Language":"English","Country":"USA","Awards":"15 wins & 7 nominations.","Poster":"http://filmgods.co.uk/wp-content/uploads/2014/07/Fault-In-Our-Stars-Movie-Poster-400x600.jpg","Metascore":"69","imdbRating":"8.0","imdbVotes":"171,925","imdbID":"tt2582846","Type":"movie","Response":"True"},
				{"Title":"Kingsman: The Secret Service","Year":"2014","Rated":"R","Released":"13 Feb 2015","Runtime":"129 min","Genre":"Action, Adventure, Comedy","Director":"Matthew Vaughn","Writer":"Jane Goldman (screenplay), Matthew Vaughn (screenplay), Mark Millar (comic book \"The Secret Service\"), Dave Gibbons (comic book \"The Secret Service\")","Actors":"Adrian Quinton, Colin Firth, Mark Strong, Jonno Davies","Plot":"Based upon the acclaimed comic book and directed by Matthew Vaughn, Kingsman: The Secret Service tells the story of a super-secret spy organization that recruits an unrefined but promising street kid into the agency's ultra-competitive training program just as a global threat emerges from a twisted tech genius.","Language":"English, Arabic, Swedish","Country":"UK, USA","Awards":"N/A","Poster":"http://static.rogerebert.com/uploads/movie/movie_poster/kingsman-the-secret-service-2015/large_pXN5zQHdqmvpUZDPkLooGD6PnAW.jpg","Metascore":"59","imdbRating":"8.2","imdbVotes":"91,729","imdbID":"tt2802144","Type":"movie","Response":"True"}
			];
			
			$scope.logout = function () {
				// Delete user data
				AuthenticationService.eraseAllData();
                AuthenticationService.removeUserAsAuthenticated(false);
				
				// Send the user to the landing page
				$location.path('/landingpage');
			};
			
			$rootScope.$on('syncUpdate', function (data) {
				
			});
			
//			var omdbUrl = 'http://www.omdbapi.com/?t=inception&y=&plot=full&r=json';
//			OMDB.getMovie(omdbUrl).
//				success(function(data, status, headers, config) {
//					// this callback will be called asynchronously
//					// when the response is available
//					$timeout(function () {
//						$scope.movie = {
//							Actors: data.Actors,
//							Awards: data.Awards,
//							Country: data.Country,
//							Director: data.Director,
//							Genre: data.Genre,
//							Language: data.Language,
//							Metascore: data.Metascore,
//							Plot: data.Plot,
//							Poster: data.Poster,
//							Rated: data.Rated,
//							Released: data.Released,
//							Response: data.Response,
//							Runtime: data.Runtime,
//							Title: data.Title,
//							Type: data.Type,
//							Writer: data.Writer,
//							Year: data.Year,
//							imdbID: data.imdbID,
//							imdbRating: data.imdbRating,
//							imdbVotes: data.imdbVotes
//						}
//						
//						var splt = $scope.movie.Poster.split('/')[5];
//						$scope.imageSrc = 'http://86.127.142.109:8080/RecommendationSystem/image/' + splt.substring(0, splt.length - 4);
//					});
//				}).
//				error(function(data, status, headers, config) {
//					// called asynchronously if an error occurs
//					// or server returns response with an error status.
//					console.log("Error when getting the movie from OMDB");
//				});
			
		}])
		.controller('LandingPageController', ['$scope', '$location', '$timeout', 'AuthenticationService', function ($scope, $location, $timeout, AuthenticationService) {
			
			// If user is already authenticated, redirect to home
			if (AuthenticationService.isUserAuthenticated()) {
                $location.path('/');
            }

			$scope.facebookLogin = function () {
				FB.login(function (response) {
					AuthenticationService.setUserAsAuthenticated(response);
					$timeout(function () {
						$location.path('/');
					});
				});
			}
			
			$scope.test = function () {
				$location.path('/');
			};

		}]);
});