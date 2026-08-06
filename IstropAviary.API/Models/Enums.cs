namespace IstropAviary.API.Models;

public enum Gender { Male, Female, Unknown }
public enum BirdStatus { Breeder, Chick, ForSale, Sold, InTreatment, Deceased }
public enum NestStatus { Active, HasChicks, InPreparation, Empty }
public enum EggStatus { Incubating, Fertile, Infertile, Hatched, DeadInShell }
public enum TransactionType { Income, Expense }
public enum SystemTaskType { Candling, Hatching, Banding, Weaning, CustomCare }
