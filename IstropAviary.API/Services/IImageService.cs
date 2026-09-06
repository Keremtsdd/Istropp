using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace IstropAviary.API.Services
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file, string folderName);
    }
}
