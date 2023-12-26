using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TweetApp.Backend.Dto;
using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Models;
using TweetApp.Backend.Rabbitmq;
using TweetApp.Backend.ServiceBus;

namespace TweetApp.Backend.Controllers
{
    [Route("api/v1/tweets")]
    [EnableCors]
    [ApiController]
    [Authorize]
    public class TweetsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRabbitMQMessageSender _messageSender;
        protected ResponseDto _response;
        //private readonly IServiceBusSender _sender;

        public TweetsController(IUnitOfWork unitOfWork, IMapper mapper, IRabbitMQMessageSender messageSender)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _messageSender = messageSender;
            _response = new ResponseDto();
            //_sender = sender;
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<object> GetAllTweets()
        {
            try
            {
                var tweets = await _unitOfWork.Tweet.GetAll();
                _response.Result = tweets;
                _response.DisplayMessage = "List of tweets fetched successfully";
                Log.Information("List of tweets fetched successfully");
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong!");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong!";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPost("{username}/add")]
        public async Task<object> PostTweet([FromRoute] string username, [FromBody] CreateTweetDto tweetDto)
        {
            try
            {
                var tweet = _mapper.Map<Tweet>(tweetDto);
                tweet.UserId = username;
                await _unitOfWork.Tweet.Add(tweet);
                await _unitOfWork.Save();
                _response.Result = tweet;
                _response.DisplayMessage = "Tweet posted successfully";
            }
            catch (Exception ex)
            {
                Log.Error("Somethin went wrong!");


                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong!";
                if (ex.InnerException != null)
                {
                    _response.InnerException = new List<string> { ex.InnerException.Message };
                }
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpGet("{username}")]
        public async Task<object> GetTweetsByUsername(string username)
        {
            try
            {
                var tweets = await _unitOfWork.Tweet.GetAll(x => x.UserId == username);
                _response.Result = tweets;
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong!");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong!";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPut("{username}/update/{id:int}")]
        public async Task<object> UpdateTweet([FromRoute] string username, [FromRoute] int id, [FromBody] CreateTweetDto updateTweetDto)
        {
            try
            {
                var tweet = await _unitOfWork.Tweet.Get(x => x.Id == id);
                tweet.Subject = updateTweetDto.Subject;
                _unitOfWork.Tweet.Update(tweet);
                await _unitOfWork.Save();
                _response.Result = tweet;
                _response.DisplayMessage = "Tweet updated successfully";
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong while updating tweet! Please try again later.");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while updating tweet! Please try again later.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [Route("{username}/delete/{id:int}")]
        [HttpDelete]
        public async Task<object> DeleteTweet([FromRoute] string username, [FromRoute] int id)
        {
            try
            {
                var tweet = await _unitOfWork.Tweet.Get(x => x.Id == id) ?? throw new Exception("Tweet not found");
                _unitOfWork.Tweet.Delete(tweet);
                await _unitOfWork.Save();
                _response.IsSuccess = true;
                _response.Result = true;
                _response.DisplayMessage = "Tweet deleted successfully";
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong while deleting tweet! Please try again later.");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while deleting tweet! Please try again later.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [AllowAnonymous]
        [HttpGet("replies")]
        public async Task<object> GetRepliesList()
        {
            try
            {
                var replies = await _unitOfWork.TweetReply.GetAll();
                replies = replies.OrderByDescending(x => x.DatePosted);

                var responseReply = new List<ReplyResponse>();

                foreach (var item in replies)
                {
                    responseReply.Add(_mapper.Map<ReplyResponse>(item));
                }
                _response.IsSuccess = true;
                _response.Result = responseReply;
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return _response;

        }

        [AllowAnonymous]
        [HttpGet("reactions")]
        public async Task<object> GetAllReactions()
        {
            try
            {
                var responses = await _unitOfWork.Like.GetAll();
                _response.Result = responses;
                _response.DisplayMessage = "Reactions fetched";
            }
            catch (Exception ex)
            {
                _response.Result = false;
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPost("{username}/reply/{id}")]
        public async Task<object> ReplyTweet([FromRoute] string username, [FromRoute] int id, [FromBody] ReplyDto message)
        {
            try
            {
                TweetReply reply = new()
                {
                    UserId = username,
                    TweetId = id,
                    Message = message.message
                };
                await _unitOfWork.TweetReply.Add(reply);
                await _unitOfWork.Save();
                _response.IsSuccess = true;
                _response.DisplayMessage = "Replied Successfully";
            }
            catch (Exception ex)
            {
                Log.Error("Something went wrong while replying the tweet! Please try again later.");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while replying the tweet! Please try again later.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPost("{username}/like/{id}")]
        public async Task<object> LikeTweet([FromRoute] string username, [FromRoute] int id)
        {
            try
            {
                var user = await _unitOfWork.User.Get(x => x.Email == username);
                if (user == null)
                    return 0;

                var like = await _unitOfWork.Like.Get(x => x.TweetId == id && x.UserId == username);

                if (like == null)
                {
                    var _like = new Like
                    {
                        TweetId = id,
                        UserId = username,
                    };
                    await _unitOfWork.Like.Add(_like);
                    await _unitOfWork.Save();
                    _response.IsSuccess = true;
                    _response.DisplayMessage = "Tweet liked successfully";
                }
                else
                {
                    _response.IsSuccess = false;
                    _response.DisplayMessage = "Already liked";
                }

            }
            catch (Exception ex)
            {
                _response.Result = false;
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while replying the tweet! Please try again later.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpGet("details/{id}")]
        public async Task<object> GetATweet(int id)
        {
            try
            {
                var tweet = await _unitOfWork.Tweet.Get(x => x.Id == id);
                if (tweet == null)
                    throw new Exception("No tweets found");
                _response.Result = tweet;
                _response.DisplayMessage = "Tweet fetched successfully";
            }
            catch (Exception ex)
            {
                _response.Result = false;
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while displaying the tweet! Please try again later.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpGet("like/{id}")]
        public async Task<object> GetLikeCountOfTweet(int id)
        {
            try
            {
                var list = await _unitOfWork.Like.GetAll(x => x.TweetId == id);
                var likes = list.Count();
                _response.Result = likes;
                _response.DisplayMessage = "Tweet Count fetched successfully";
            }
            catch (Exception ex)
            {
                _response.Result = false;
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }


    }
}
