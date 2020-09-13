<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccessRecord extends Model
{
  protected $fillable = [
      'passanger-number',
      'number-room',
      'state',
  ];
}
