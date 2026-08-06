using System;
using System.Threading.Tasks;

namespace IstropAviary.API.Services;

public interface IBreedingAutomationService
{
    Task PairBirdsAsync(int maleId, int femaleId, int nestId);
    Task LogEggAsync(int pairId, DateTime laidDate);
    Task LogHatchAsync(int eggId, DateTime hatchDate);
}
