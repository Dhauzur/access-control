<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
      $this->truncateTables([
          'type_pensions',
          'access_records'
      ]);

      // Ejecutar los seeders:
      $this->call(TypePensionsSeeder::class);

  }

  public function truncateTables(array $tables)
  {
      DB::statement('SET FOREIGN_KEY_CHECKS = 0;');

      foreach ($tables as $table) {
          DB::table($table)->truncate();
      }

      DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
  }
}
