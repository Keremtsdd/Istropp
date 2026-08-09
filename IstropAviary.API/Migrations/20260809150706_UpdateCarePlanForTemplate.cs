using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IstropAviary.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCarePlanForTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarePlans_Birds_RelatedBirdId",
                table: "CarePlans");

            migrationBuilder.DropForeignKey(
                name: "FK_CarePlans_Nests_RelatedNestId",
                table: "CarePlans");

            migrationBuilder.DropIndex(
                name: "IX_CarePlans_RelatedBirdId",
                table: "CarePlans");

            migrationBuilder.DropIndex(
                name: "IX_CarePlans_RelatedNestId",
                table: "CarePlans");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "CarePlans");

            migrationBuilder.DropColumn(
                name: "RelatedBirdId",
                table: "CarePlans");

            migrationBuilder.DropColumn(
                name: "RelatedNestId",
                table: "CarePlans");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "CarePlans",
                newName: "WaterDosage");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "CarePlans",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "CarePlans",
                newName: "Purpose");

            migrationBuilder.AddColumn<int>(
                name: "DayNumber",
                table: "CarePlans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FoodDosage",
                table: "CarePlans",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayNumber",
                table: "CarePlans");

            migrationBuilder.DropColumn(
                name: "FoodDosage",
                table: "CarePlans");

            migrationBuilder.RenameColumn(
                name: "WaterDosage",
                table: "CarePlans",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "Purpose",
                table: "CarePlans",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "CarePlans",
                newName: "Title");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "CarePlans",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RelatedBirdId",
                table: "CarePlans",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RelatedNestId",
                table: "CarePlans",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CarePlans_RelatedBirdId",
                table: "CarePlans",
                column: "RelatedBirdId");

            migrationBuilder.CreateIndex(
                name: "IX_CarePlans_RelatedNestId",
                table: "CarePlans",
                column: "RelatedNestId");

            migrationBuilder.AddForeignKey(
                name: "FK_CarePlans_Birds_RelatedBirdId",
                table: "CarePlans",
                column: "RelatedBirdId",
                principalTable: "Birds",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CarePlans_Nests_RelatedNestId",
                table: "CarePlans",
                column: "RelatedNestId",
                principalTable: "Nests",
                principalColumn: "Id");
        }
    }
}
