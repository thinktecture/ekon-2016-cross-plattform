unit UMainForm;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs,

  UMainModule, Vcl.Mask, Vcl.DBCtrls, Vcl.ExtCtrls, Vcl.StdCtrls;

type
  TMainForm = class(TForm)
    memQuote: TDBMemo;
    nvgQuotes: TDBNavigator;
    edtSource: TDBEdit;
    lblSource: TLabel;
    lblQuote: TLabel;
    lblId: TLabel;
    edtId: TDBEdit;
    lblNav: TLabel;
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  MainForm: TMainForm;

implementation

{$R *.dfm}

end.
