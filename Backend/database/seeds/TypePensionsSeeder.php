<?php

use Illuminate\Database\Seeder;
use App\TypePension;

class TypePensionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      TypePension::create(['name'=>'Alojamiento']);
      TypePension::create(['name'=>'Desayuno']);
      TypePension::create(['name'=>'Almuerzo']);
      TypePension::create([ 'name'=>'Cena']);
    }
}
