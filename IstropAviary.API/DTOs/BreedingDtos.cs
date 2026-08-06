using System;

namespace IstropAviary.API.DTOs;

public class PairBirdsRequest
{
    public int MaleId { get; set; }
    public int FemaleId { get; set; }
    public int NestId { get; set; }
}

public class LogEggRequest
{
    public int PairId { get; set; }
    public DateTime LaidDate { get; set; }
}

public class LogHatchRequest
{
    public int EggId { get; set; }
    public DateTime HatchDate { get; set; }
}
