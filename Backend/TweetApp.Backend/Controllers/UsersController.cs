using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Serilog;
using System.Security.Cryptography;
using TweetApp.Backend.Dto;
using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Jwt;
using TweetApp.Backend.Models;
using TweetApp.Backend.Rabbitmq;
using TweetApp.Backend.ServiceBus;

namespace TweetApp.Backend.Controllers
{
    [Route("api/v1/tweets")]
    [EnableCors]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRabbitMQMessageSender _messageSender;
        private readonly IJwtService _jwtService;
        protected ResponseDto _response;
        private readonly Microsoft.Extensions.Logging.ILogger<UsersController> _logger;
        //private readonly IServiceBusSender _sender;

        public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IRabbitMQMessageSender messageSender, IOptions<AppSettings> appSettings, Microsoft.Extensions.Logging.ILogger<UsersController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _messageSender = messageSender;
            _response = new ResponseDto();
            _jwtService = new JwtService(appSettings);
            _logger = logger;
            //_sender = sender;
        }

        [AllowAnonymous]
        [HttpGet("users/all")]
        public async Task<object> GetAllUsers()
        {
            try
            {
                var users = await _unitOfWork.User.GetAll();
                var specificProperties = users.Select(u => new
                {
                    u.FirstName,
                    u.LastName,
                    u.Email
                }).ToList();
                _response.DisplayMessage = "User list retrieved successfully";
                _response.Result = specificProperties;
                Log.Information("Getting all users");
            }
            catch (Exception ex)
            {
                Log.Error("Error cannot find the list");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Error cannot find the list";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpGet("search/{username}")]
        public async Task<object> GetUser(string username)
        {
            try
            {
                var user = await _unitOfWork.User.Get(x => x.Email == username);
                _response.Result = user;

                if (user == null)
                {
                    _response.DisplayMessage = "No user found";
                    Log.Error("No user found");
                }
                else
                {
                    _response.DisplayMessage = "User retrieved successfully";
                    Log.Information("User retrieved successfully");
                }
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

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<object> Register([FromBody] User userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    throw new Exception("Invalid data");
                if (await _unitOfWork.User.IsUniqueUser(userDto.Email))
                {
                    await _unitOfWork.User.Add(userDto);
                    await _unitOfWork.Save();
                    _response.IsSuccess = true;
                    _response.Result = userDto.Email;
                    _response.DisplayMessage = "User registered successfully";
                }
                else
                    throw new Exception("Username already exists");
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.DisplayMessage = "Error cannot register";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<object> Login([FromBody] LoginDto model)
        {
            try
            {

                var user = await _unitOfWork.User.Get(x => x.Email == model.Username && x.Password == model.Password);

                if (user == null) throw new Exception("Invalid username or password");

                var token = _jwtService.GenerateToken(model);
                _response.Result = new User { FirstName = user.FirstName, LastName = user.LastName, Email = user.Email };
                _response.DisplayMessage = "Login successful for " + model.Username;
                _response.Token = token;
            }
            catch (Exception ex)
            {
                _logger.LogError("Invalid username or password");
                //Log.Error("Invalid username or password");
                // Log.Information("Inf");
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong while logging in.";
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            _messageSender.Publish(_response.DisplayMessage);
            //await _sender.SendMessageAsync(_response.DisplayMessage);
            return _response;
        }

        [HttpPatch("forgot/{username}")]
        [AllowAnonymous]
        public async Task<object> ForgotPassword([FromRoute] string username, [FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var user = await _unitOfWork.User.Get(x => x.Email == resetPasswordDto.Username);
                if (user == null) throw new Exception("User not found");
                user.Password = resetPasswordDto.Password;
                _unitOfWork.User.Update(user);
                await _unitOfWork.Save();

                _response.DisplayMessage = "Password reset successfull";
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.DisplayMessage = "Something went wrong!";
                //Innerexception working.
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

    }
}
