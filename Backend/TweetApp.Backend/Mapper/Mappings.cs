using AutoMapper;
using TweetApp.Backend.Dto;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Mapper
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<RegisterDto, User>().ReverseMap();
            CreateMap<CreateTweetDto, Tweet>().ReverseMap();
            //CreateMap<ReactionResponse, Like>().ReverseMap();
            CreateMap<ReplyResponse, TweetReply>().ReverseMap();
        }
    }
}
