using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IstropAviary.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Aviaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LogoUrl = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    Website = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aviaries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SaleNumber = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CustomerName = table.Column<string>(type: "text", nullable: true),
                    CustomerPhone = table.Column<string>(type: "text", nullable: true),
                    CustomerCity = table.Column<string>(type: "text", nullable: true),
                    PaymentType = table.Column<string>(type: "text", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sales", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NestCode = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AviaryId = table.Column<int>(type: "integer", nullable: true),
                    NextAction = table.Column<string>(type: "text", nullable: true),
                    NextActionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nests_Aviaries_AviaryId",
                        column: x => x.AviaryId,
                        principalTable: "Aviaries",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Birds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BandNumber = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    Mutation = table.Column<string>(type: "text", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    RingColor = table.Column<string>(type: "text", nullable: true),
                    BeakColor = table.Column<string>(type: "text", nullable: true),
                    EyeColor = table.Column<string>(type: "text", nullable: true),
                    FeatherCondition = table.Column<string>(type: "text", nullable: true),
                    HealthStatus = table.Column<string>(type: "text", nullable: true),
                    MotherId = table.Column<int>(type: "integer", nullable: true),
                    FatherId = table.Column<int>(type: "integer", nullable: true),
                    NestId = table.Column<int>(type: "integer", nullable: true),
                    AviaryId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Birds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Birds_Aviaries_AviaryId",
                        column: x => x.AviaryId,
                        principalTable: "Aviaries",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Birds_Birds_FatherId",
                        column: x => x.FatherId,
                        principalTable: "Birds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Birds_Birds_MotherId",
                        column: x => x.MotherId,
                        principalTable: "Birds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Birds_Nests_NestId",
                        column: x => x.NestId,
                        principalTable: "Nests",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Clutches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NestId = table.Column<int>(type: "integer", nullable: false),
                    LaidDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HatchDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BandingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clutches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clutches_Nests_NestId",
                        column: x => x.NestId,
                        principalTable: "Nests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CarePlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    RelatedBirdId = table.Column<int>(type: "integer", nullable: true),
                    RelatedNestId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarePlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarePlans_Birds_RelatedBirdId",
                        column: x => x.RelatedBirdId,
                        principalTable: "Birds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarePlans_Nests_RelatedNestId",
                        column: x => x.RelatedNestId,
                        principalTable: "Nests",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SaleDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SaleId = table.Column<int>(type: "integer", nullable: false),
                    BirdId = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SaleDetails_Birds_BirdId",
                        column: x => x.BirdId,
                        principalTable: "Birds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaleDetails_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Birds_AviaryId",
                table: "Birds",
                column: "AviaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_FatherId",
                table: "Birds",
                column: "FatherId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_MotherId",
                table: "Birds",
                column: "MotherId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_NestId",
                table: "Birds",
                column: "NestId");

            migrationBuilder.CreateIndex(
                name: "IX_CarePlans_RelatedBirdId",
                table: "CarePlans",
                column: "RelatedBirdId");

            migrationBuilder.CreateIndex(
                name: "IX_CarePlans_RelatedNestId",
                table: "CarePlans",
                column: "RelatedNestId");

            migrationBuilder.CreateIndex(
                name: "IX_Clutches_NestId",
                table: "Clutches",
                column: "NestId");

            migrationBuilder.CreateIndex(
                name: "IX_Nests_AviaryId",
                table: "Nests",
                column: "AviaryId");

            migrationBuilder.CreateIndex(
                name: "IX_SaleDetails_BirdId",
                table: "SaleDetails",
                column: "BirdId");

            migrationBuilder.CreateIndex(
                name: "IX_SaleDetails_SaleId",
                table: "SaleDetails",
                column: "SaleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarePlans");

            migrationBuilder.DropTable(
                name: "Clutches");

            migrationBuilder.DropTable(
                name: "SaleDetails");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Birds");

            migrationBuilder.DropTable(
                name: "Sales");

            migrationBuilder.DropTable(
                name: "Nests");

            migrationBuilder.DropTable(
                name: "Aviaries");
        }
    }
}
