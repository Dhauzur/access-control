<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AccessRecords extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('access_records', function (Blueprint $table) {
        $table->increments('id')->unique();
        $table->integer('passanger-number')->unsigned();
        $table->integer('id-type-pension')->nullable()->unsigned()->index();
        $table->integer('number-room')->unsigned();
        $table->integer('state')->unsigned();
        $table->timestamps();
        $table->foreign('id-type-pension')->references('id')->on('type_pensions');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('access_records');
    }
}
