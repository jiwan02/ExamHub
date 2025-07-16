using Examhub.Models;
using Microsoft.EntityFrameworkCore;

namespace Examhub.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Vacancy> Vacancies { get; set; }
        public DbSet<VacancyImage> VacancyImages { get; set; }
        public DbSet<VacancyUpdate> VacancyUpdates { get; set; }
        public DbSet<VacancyUpdateImage> VacancyUpdateImages { get; set; }
        public DbSet<TrackedVacancy> TrackedVacancies { get; set; }
        public DbSet<UserVacancyRating> UserVacancyRatings { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<StudyMaterial> StudyMaterials { get; set; }
        public DbSet<TestResult> TestResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure TrackedVacancies relationships
            modelBuilder.Entity<TrackedVacancy>()
                .HasOne(tv => tv.User)
                .WithMany()
                .HasForeignKey(tv => tv.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TrackedVacancy>()
                .HasOne(tv => tv.Vacancy)
                .WithMany()
                .HasForeignKey(tv => tv.VacancyId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure UserVacancyRatings relationships
            modelBuilder.Entity<UserVacancyRating>()
                .HasOne(uvr => uvr.User)
                .WithMany()
                .HasForeignKey(uvr => uvr.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserVacancyRating>()
                .HasOne(uvr => uvr.Vacancy)
                .WithMany()
                .HasForeignKey(uvr => uvr.VacancyId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure StudyMaterials relationships
            modelBuilder.Entity<StudyMaterial>()
                .HasOne(sm => sm.UploadedBy)
                .WithMany()
                .HasForeignKey(sm => sm.UploadedById)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StudyMaterial>()
                .HasOne(sm => sm.Category)
                .WithMany(c => c.StudyMaterials)
                .HasForeignKey(sm => sm.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StudyMaterial>()
                .HasOne(sm => sm.Topic)
                .WithMany(t => t.StudyMaterials)
                .HasForeignKey(sm => sm.TopicId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure TestResults relationships
            modelBuilder.Entity<TestResult>()
                .HasOne(tr => tr.User)
                .WithMany()
                .HasForeignKey(tr => tr.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TestResult>()
                .HasOne(tr => tr.StudyMaterial)
                .WithMany()
                .HasForeignKey(tr => tr.StudyMaterialId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}