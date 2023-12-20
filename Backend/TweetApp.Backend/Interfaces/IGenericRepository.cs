using System.Linq.Expressions;

namespace TweetApp.Backend.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> Get(Expression<Func<T, bool>> filter, string? includeProperties = null);
        Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);
        Task Add(T entity);
        void Delete(T entity);
        void Update(T entity);
    }
}
